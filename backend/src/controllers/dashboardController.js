const db = require("../config/db");

class DashboardController {
    static async getStats(req, res) {
        try {
            const [revenueRes] = await db.execute(
                "SELECT SUM(total) as total FROM orders WHERE status = 'completed'"
            );
            const totalRevenue = revenueRes[0].total || 0;

            const [monthRes] = await db.execute(`
                SELECT SUM(total) as total 
                FROM orders 
                WHERE status = 'completed' 
                AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
                AND YEAR(created_at) = YEAR(CURRENT_DATE())
            `);
            const monthlyRevenue = monthRes[0].total || 0;

            const [yearRes] = await db.execute(`
                SELECT SUM(total) as total 
                FROM orders 
                WHERE status = 'completed' 
                AND YEAR(created_at) = YEAR(CURRENT_DATE())
            `);
            const yearlyRevenue = yearRes[0].total || 0;

            const [ordersRes] = await db.execute(
                "SELECT COUNT(*) as count FROM orders"
            );
            const totalOrders = ordersRes[0].count;

            const [usersRes] = await db.execute(
                "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
            );
            const totalUsers = usersRes[0].count;

            const [productsRes] = await db.execute(
                "SELECT COUNT(*) as count FROM products WHERE is_active = 1"
            );
            const totalProducts = productsRes[0].count;

            const [recentOrders] = await db.execute(`
                SELECT id, full_name, total, status, created_at 
                FROM orders 
                ORDER BY created_at DESC 
                LIMIT 5
            `);

            const [dailyStats] = await db.execute(`
                SELECT 
                    DATE(created_at) as date, 
                    SUM(total) as sales 
                FROM orders 
                WHERE status = 'completed' 
                AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(created_at)
                ORDER BY date ASC
            `);

            const chartData = [];
            const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);

                const dateKey = d.toLocaleDateString("en-CA");

                const stat = dailyStats.find((item) => {
                    const itemDate = new Date(item.date).toLocaleDateString(
                        "en-CA"
                    );
                    return itemDate === dateKey;
                });

                const dayLabel = dayNames[d.getDay()];

                chartData.push({
                    name: dayLabel,
                    date: dateKey,
                    sales: stat ? Number(stat.sales) : 0,
                });
            }

            res.json({
                counts: {
                    revenue: totalRevenue,
                    monthlyRevenue,
                    yearlyRevenue,
                    orders: totalOrders,
                    users: totalUsers,
                    products: totalProducts,
                },
                recentOrders,
                chartData,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching dashboard stats" });
        }
    }
}

module.exports = DashboardController;
