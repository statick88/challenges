const lastUpdated = "2026-01-28T17:47:35.534Z";
const overview = {
	totalChallenges: 123,
	completed: 9,
	completionRate: 7.3,
	streak: 6
};
const programs = {
	linux: {
		total: 18,
		completed: 4,
		name: "Linux"},
	docker: {
		total: 5,
		completed: 1,
		name: "Docker"},
	devops: {
		total: 100,
		completed: 4,
		name: "DevOps"}
};
const recentActivity = [
	{
		program: "devops",
		activity: "Challenge 04 Completed",
		icon: "⚙️"
	},
	{
		program: "devops",
		activity: "Day 04 Completed",
		icon: "⚙️"
	},
	{
		program: "devops",
		activity: "Challenge 01 Completed",
		icon: "⚙️"
	},
	{
		program: "devops",
		activity: "Day 03 Completed",
		icon: "⚙️"
	},
	{
		program: "devops",
		activity: "Day 02 Completed",
		icon: "⚙️"
	},
	{
		program: "devops",
		activity: "Day 01 Completed",
		icon: "⚙️"
	},
	{
		program: "docker",
		activity: "Docker",
		icon: "🐳"
	},
	{
		program: "devops",
		activity: "DevOps",
		icon: "⚙️"
	}
];
const challenges = {
	lastUpdated: lastUpdated,
	overview: overview,
	programs: programs,
	recentActivity: recentActivity};

export { challenges as default, lastUpdated, overview, programs, recentActivity };
