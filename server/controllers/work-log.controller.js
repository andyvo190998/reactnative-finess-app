import WorkLog from '../models/work-log.model.js';
import User from '../models/user.js';

// Create a new work log
export const createWorkLog = async (req, res) => {
	try {
		const userId = req.body.userId;
		if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ error: 'A valid user ID is required' });
		}
		const userExists = await User.findById(userId);

		if (!userExists) {
			return res.status(404).json({ error: 'User not found' });
		}
		const workLog = new WorkLog(req.body);
		await workLog.save();
		res.status(201).json(workLog);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Update an existing work log
export const updateWorkLog = async (req, res) => {
	try {
		const workLog = await WorkLog.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!workLog) {
			return res.status(404).json({ error: 'WorkLog not found' });
		}
		res.json(workLog);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Get a single work log by ID
export const getWorkLog = async (req, res) => {
	try {

		const workLog = await WorkLog
			.find({ userId: req.params.id, worked: true })
			.sort({ date: -1 })
			.limit(1);

		if (!workLog) {
			return res.status(404).json({ error: 'WorkLog not found' });
		}
		res.json({ message: 'Work log retrieved successfully', workLog: workLog[0] });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// Get all work logs
export const getAllWorkLogs = async (req, res) => {
	try {
		const userId = req.params.id;
		console.log('Fetching all work logs', userId);
		if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ error: 'A valid user ID is required' });
		}

		const userExists = await User.findById(userId);
		if (!userExists) {
			return res.status(404).json({ error: 'User not found' });
		}

		// const workLogs = await WorkLog.find({ userId: userId, worked: true });
		const workLogs = await WorkLog.aggregate([
			// 1. Match only the specific user's work logs where they worked
			{
				$match: {
					userId: userId,
					worked: true
				}
			},
			// 2. Sort by date ascending
			{
				$sort: { date: 1 }
			},
			// 3. Add a running index and date-diff group marker
			{
				$setWindowFields: {
					partitionBy: "$userId",
					sortBy: { date: 1 },
					output: {
						prevDate: {
							$shift: { output: "$date", by: -1 }
						}
					}
				}
			},
			// 4. Mark new groups based on date gaps
			{
				$addFields: {
					gap: {
						$cond: [
							{
								$ne: [
									{
										$dateDiff: {
											startDate: "$prevDate",
											endDate: "$date",
											unit: "day"
										}
									},
									1
								]
							},
							true,  // There is a gap (not consecutive)
							false  // Consecutive, so no gap
						]
					}
				}
			},
			// 5. Create a running group number
			{
				$setWindowFields: {
					partitionBy: "$userId",
					sortBy: { date: 1 },
					output: {
						groupNum: {
							$sum: {
								$cond: ["$gap", 1, 0]
							},
							window: { documents: ["unbounded", "current"] }
						}
					}
				}
			},
			// 6. Group by streak
			{
				$group: {
					_id: "$groupNum",
					startDate: { $first: "$date" },
					endDate: { $last: "$date" },
					days: { $sum: 1 }
				}
			},
			// Optional: sort by startDate
			{
				$sort: { startDate: 1 }
			}
		]);

		res.json(workLogs);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};