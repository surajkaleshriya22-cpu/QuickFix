package com.quickfix.app.data.model

data class ServiceItem(
    val id: String,
    val category: String, // "electrician" | "plumber"
    val title: String,
    val hindiTitle: String? = null,
    val startingPrice: Int,
    val rating: Double,
    val warrantyDays: Int
)

data class Booking(
    val id: String,
    val serviceTitle: String,
    val category: String,
    val customerName: String,
    val customerAddress: String,
    val status: String, // "requested", "assigned", "technician_en_route", "in_progress", "completed"
    val technicianName: String? = null,
    val startOtp: String = "4821",
    val price: Int = 199,
    val totalAmount: Int = 257,
    val technicianPayout: Int = 226,
    val adminCommission: Int = 31
)

data class CommissionSettings(
    val electricianCommissionPct: Int = 12,
    val plumberCommissionPct: Int = 15,
    val convenienceFee: Int = 29,
    val gstPct: Int = 18
)
