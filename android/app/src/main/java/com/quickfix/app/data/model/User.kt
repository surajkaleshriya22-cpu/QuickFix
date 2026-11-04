package com.quickfix.app.data.model

enum class UserRole {
    CUSTOMER,
    TECHNICIAN,
    ADMIN
}

data class User(
    val uid: String = "",
    val phoneNumber: String = "",
    val displayName: String = "",
    val email: String = "",
    val role: UserRole = UserRole.CUSTOMER,
    val address: String = "",
    val city: String = "Bengaluru",
    val pincode: String = "560034",
    // Partner specific
    val trades: List<String> = emptyList(), // "electrician", "plumber"
    val experienceYears: Int = 0,
    val kycDocType: String = "",
    val kycDocNumber: String = "",
    val isVerified: Boolean = false,
    val upiId: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class OtpSent(val verificationId: String, val phoneNumber: String) : AuthState()
    data class Authenticated(val user: User) : AuthState()
    data class Error(val message: String) : AuthState()
}
