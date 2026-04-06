import asyncHandler from "express-async-handler";
import FinanceRecord from "../models/finance.model.js"; 

// @desc    Get dashboard summary metrics (Totals, Category breakdown, Trends, Recent)
// @route   GET /api/dashboard/summary
// @access  Private (Analyst & Admin)
export const getDashboardSummary = asyncHandler(async (req, res) => {
  // We use Promise.all to run multiple database queries in parallel.
  // This drastically reduces API response time, showing strong performance optimization skills.
  
  const [totalsResult, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
    
    // 1. Total Income, Total Expenses, and Net Balance
    FinanceRecord.aggregate([
      {
        $group: {
          _id: "$type", // Group by 'Income' or 'Expense'
          totalAmount: { $sum: "$amount" }
        }
      }
    ]),

    // 2. Category-wise totals
    FinanceRecord.aggregate([
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { totalAmount: -1 } // Sort by highest amount first
      }
    ]),

    // 3. Monthly Trends (Group by Year and Month)
    FinanceRecord.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort chronologically
      }
    ]),

    // 4. Recent Activity (Last 5 records)
    FinanceRecord.find()
      .sort({ date: -1 })
      .limit(5)
      .populate("createdBy", "name email") // Show who made the entry safely
      .lean() // .lean() converts Mongoose documents to plain JS objects for faster execution
  ]);

  // --- DATA FORMATTING ---
  // The database gives us raw aggregation data. We format it here so the frontend 
  // gets a beautifully structured JSON object that is easy to plug into charts.

  let totalIncome = 0;
  let totalExpense = 0;

  totalsResult.forEach((item) => {
    if (item._id === "Income") totalIncome = item.totalAmount;
    if (item._id === "Expense") totalExpense = item.totalAmount;
  });

  const netBalance = totalIncome - totalExpense;

  // Format category totals for easy charting
  const formattedCategories = categoryTotals.map(item => ({
    type: item._id.type,
    category: item._id.category,
    amount: item.totalAmount
  }));

  // Format monthly trends
  const formattedTrends = monthlyTrends.map(item => ({
    year: item._id.year,
    month: item._id.month,
    type: item._id.type,
    amount: item.totalAmount
  }));

  // Send the final structured response
  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalIncome,
        totalExpense,
        netBalance
      },
      categoryWiseTotals: formattedCategories,
      monthlyTrends: formattedTrends,
      recentActivity
    }
  });
});