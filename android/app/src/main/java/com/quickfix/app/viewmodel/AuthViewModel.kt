package com.quickfix.app.viewmodel

import android.app.Activity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.PhoneAuthProvider
import com.quickfix.app.data.model.AuthState
import com.quickfix.app.data.model.User
import com.quickfix.app.data.model.UserRole
import com.quickfix.app.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel(
    private val repository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private var currentVerificationId: String = ""

    init {
        checkExistingSession()
    }

    private fun checkExistingSession() {
        if (repository.isUserLoggedIn) {
            val uid = repository.currentUserUid ?: return
            viewModelScope.launch {
                try {
                    _authState.value = AuthState.Loading
                    val profile = repository.getUserProfile(uid)
                    if (profile != null) {
                        _authState.value = AuthState.Authenticated(profile)
                    } else {
                        _authState.value = AuthState.Idle
                    }
                } catch (e: Exception) {
                    _authState.value = AuthState.Idle
                }
            }
        }
    }

    fun sendOtp(phoneNumber: String, activity: Activity) {
        _authState.value = AuthState.Loading
        repository.sendPhoneOtp(
            phoneNumber = phoneNumber,
            activity = activity,
            onCodeSent = { verificationId ->
                currentVerificationId = verificationId
                _authState.value = AuthState.OtpSent(verificationId, phoneNumber)
            },
            onVerificationFailed = { exception ->
                val rawMsg = exception.localizedMessage ?: ""
                val errorMsg = when {
                    rawMsg.contains("17010") || rawMsg.contains("app is not authorized") ->
                        "Firebase Config Required: Add your Android SHA-1 fingerprint to Firebase Console (Project Settings > Android App)."
                    rawMsg.contains("39") || rawMsg.contains("Play Integrity") || rawMsg.contains("reCAPTCHA") ->
                        "Play Integrity / SafetyNet check failed. Ensure SHA-256 fingerprint is added to Firebase Console."
                    rawMsg.contains("BILLING") || rawMsg.contains("quota") ->
                        "SMS Quota Reached: Test with Firebase Authentication Test Phone Numbers configured in Firebase Console."
                    else ->
                        if (rawMsg.isNotEmpty()) rawMsg else "Failed to send SMS OTP. Please check mobile network or Firebase Phone Auth settings."
                }
                _authState.value = AuthState.Error(errorMsg)
            },
            onAutoVerified = { credential ->
                // Instant SMS auto retrieval
                viewModelScope.launch {
                    try {
                        val uid = repository.signInWithCredential(credential)
                        val existing = repository.getUserProfile(uid)
                        if (existing != null) {
                            _authState.value = AuthState.Authenticated(existing)
                        }
                    } catch (e: Exception) {
                        _authState.value = AuthState.Error(e.localizedMessage ?: "Verification error")
                    }
                }
            }
        )
    }

    fun verifyOtp(
        otpCode: String,
        pendingUser: User,
        onSuccess: (User) -> Unit
    ) {
        viewModelScope.launch {
            try {
                _authState.value = AuthState.Loading
                val credential = PhoneAuthProvider.getCredential(currentVerificationId, otpCode)
                val uid = repository.signInWithCredential(credential)

                // Check if profile exists, otherwise save new profile
                val existingProfile = repository.getUserProfile(uid)
                val userToPersist = if (existingProfile != null) {
                    existingProfile
                } else {
                    val newProfile = pendingUser.copy(uid = uid)
                    repository.saveUserProfile(newProfile)
                    newProfile
                }

                _authState.value = AuthState.Authenticated(userToPersist)
                onSuccess(userToPersist)
            } catch (e: Exception) {
                _authState.value = AuthState.Error(e.localizedMessage ?: "Invalid OTP verification code")
            }
        }
    }

    fun verifyAdminPasscode(passcode: String, phone: String, onSuccess: (User) -> Unit) {
        if (passcode.trim() == "ADMIN2026") {
            val adminUser = User(
                uid = "admin-master-uid",
                phoneNumber = phone,
                displayName = "QuickFix HQ Admin",
                email = "ops.admin@quickfix.in",
                role = UserRole.ADMIN,
                city = "Bengaluru"
            )
            _authState.value = AuthState.Authenticated(adminUser)
            onSuccess(adminUser)
        } else {
            _authState.value = AuthState.Error("Invalid Admin Passcode. Use demonstration key: ADMIN2026")
        }
    }

    fun logout() {
        repository.signOut()
        _authState.value = AuthState.Idle
    }
}
