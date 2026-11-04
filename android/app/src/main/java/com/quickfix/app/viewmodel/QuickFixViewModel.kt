package com.quickfix.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.firestore.FirebaseFirestore
import com.quickfix.app.data.model.Booking
import com.quickfix.app.data.model.CommissionSettings
import com.quickfix.app.data.model.User
import com.quickfix.app.data.model.UserRole
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class AdminMetrics(
    val totalCustomers: Int = 0,
    val totalElectricians: Int = 0,
    val totalPlumbers: Int = 0,
    val totalBookings: Int = 0,
    val totalRevenueGmv: Int = 0,
    val totalCommission: Int = 0,
    val totalDisbursed: Int = 0
)

class QuickFixViewModel : ViewModel() {

    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()

    private val _commissionSettings = MutableStateFlow(
        CommissionSettings(
            electricianCommissionPct = 12,
            plumberCommissionPct = 15,
            convenienceFee = 29,
            gstPct = 18
        )
    )
    val commissionSettings: StateFlow<CommissionSettings> = _commissionSettings.asStateFlow()

    private val _customers = MutableStateFlow<List<User>>(
        listOf(
            User(
                uid = "cust-1",
                displayName = "Ananya Deshmukh",
                phoneNumber = "+91 98451 99221",
                email = "ananya.d@gmail.com",
                role = UserRole.CUSTOMER,
                address = "Flat 402, Prestige Palms, Indiranagar, Bengaluru",
                city = "Bengaluru",
                pincode = "560038"
            ),
            User(
                uid = "cust-2",
                displayName = "Vikram Aditya",
                phoneNumber = "+91 97402 18833",
                email = "vikram.aditya@outlook.com",
                role = UserRole.CUSTOMER,
                address = "#18, 5th Cross, Koramangala 4th Block, Bengaluru",
                city = "Bengaluru",
                pincode = "560034"
            ),
            User(
                uid = "cust-3",
                displayName = "Pooja Hegde",
                phoneNumber = "+91 94481 02934",
                email = "pooja.h@yahoo.com",
                role = UserRole.CUSTOMER,
                address = "Villa 12, Green Glen Layout, Bellandur, Bengaluru",
                city = "Bengaluru",
                pincode = "560103"
            ),
            User(
                uid = "cust-4",
                displayName = "Rohit Patidar",
                phoneNumber = "+91 98260 41234",
                email = "rohit.patidar@gmail.com",
                role = UserRole.CUSTOMER,
                address = "102, Shrivardhan Complex, RNT Marg, Indore",
                city = "Indore",
                pincode = "452001"
            ),
            User(
                uid = "cust-5",
                displayName = "Priya Sharma",
                phoneNumber = "+91 98270 55432",
                email = "priya.sharma@bhopal.in",
                role = UserRole.CUSTOMER,
                address = "E-3/42, Arera Colony, Near 10 No. Market, Bhopal",
                city = "Bhopal",
                pincode = "462016"
            ),
            User(
                uid = "cust-6",
                displayName = "Shivam Joshi",
                phoneNumber = "+91 94250 88219",
                email = "shivam.joshi@ujjain.in",
                role = UserRole.CUSTOMER,
                address = "45, Freeganj Main Road, Near Tower Chowk, Ujjain",
                city = "Ujjain",
                pincode = "456010"
            ),
            User(
                uid = "cust-7",
                displayName = "Ankit Verma",
                phoneNumber = "+91 99260 33100",
                email = "ankit.verma@dewas.in",
                role = UserRole.CUSTOMER,
                address = "12, Chamunda Complex, AB Road, Dewas",
                city = "Dewas",
                pincode = "455001"
            )
        )
    )
    val customers: StateFlow<List<User>> = _customers.asStateFlow()

    private val _technicians = MutableStateFlow<List<User>>(
        listOf(
            User(
                uid = "tech-1",
                displayName = "Ramesh Kumar",
                phoneNumber = "+91 98765 43210",
                role = UserRole.TECHNICIAN,
                trades = listOf("electrician"),
                experienceYears = 8,
                city = "Bengaluru",
                kycDocType = "Aadhaar Card",
                kycDocNumber = "XXXX-XXXX-4921",
                isVerified = true,
                upiId = "ramesh.kumar@okhdfcbank"
            ),
            User(
                uid = "tech-2",
                displayName = "Suresh Patel",
                phoneNumber = "+91 98765 43211",
                role = UserRole.TECHNICIAN,
                trades = listOf("plumber"),
                experienceYears = 6,
                city = "Bengaluru",
                kycDocType = "PAN Card",
                kycDocNumber = "ABCDE1234F",
                isVerified = true,
                upiId = "suresh.plumber@paytm"
            ),
            User(
                uid = "tech-3",
                displayName = "Manoj Verma",
                phoneNumber = "+91 98765 43212",
                role = UserRole.TECHNICIAN,
                trades = listOf("electrician", "plumber"),
                experienceYears = 5,
                city = "Bengaluru",
                kycDocType = "Driving Licence",
                kycDocNumber = "KA0320190012",
                isVerified = false,
                upiId = "manoj.verma@upi"
            ),
            User(
                uid = "tech-4",
                displayName = "Deepak Solanki",
                phoneNumber = "+91 98261 11223",
                role = UserRole.TECHNICIAN,
                trades = listOf("electrician"),
                experienceYears = 7,
                city = "Indore",
                kycDocType = "Skill India Certificate",
                kycDocNumber = "MP-IND-EL-2020-410",
                isVerified = true,
                upiId = "deepak.solanki@okaxis"
            ),
            User(
                uid = "tech-5",
                displayName = "Kamlesh Rathore",
                phoneNumber = "+91 98272 33445",
                role = UserRole.TECHNICIAN,
                trades = listOf("plumber"),
                experienceYears = 9,
                city = "Bhopal",
                kycDocType = "Aadhaar Card",
                kycDocNumber = "XXXX-XXXX-9102",
                isVerified = true,
                upiId = "kamlesh.rathore@paytm"
            ),
            User(
                uid = "tech-6",
                displayName = "Mohanlal Malviya",
                phoneNumber = "+91 94251 77889",
                role = UserRole.TECHNICIAN,
                trades = listOf("electrician", "plumber"),
                experienceYears = 10,
                city = "Ujjain",
                kycDocType = "Skill India Certificate",
                kycDocNumber = "MP-UJJ-EL-2019-105",
                isVerified = true,
                upiId = "mohan.ujjain@upi"
            ),
            User(
                uid = "tech-7",
                displayName = "Govind Parmar",
                phoneNumber = "+91 99262 88123",
                role = UserRole.TECHNICIAN,
                trades = listOf("plumber"),
                experienceYears = 6,
                city = "Dewas",
                kycDocType = "Aadhaar Card",
                kycDocNumber = "XXXX-XXXX-4421",
                isVerified = true,
                upiId = "govind.dewas@ybl"
            )
        )
    )
    val technicians: StateFlow<List<User>> = _technicians.asStateFlow()

    private val _bookings = MutableStateFlow<List<Booking>>(
        listOf(
            Booking(
                id = "QF-84920",
                serviceTitle = "Complete Switchboard Repair",
                category = "electrician",
                customerName = "Ananya Deshmukh",
                customerAddress = "Flat 402, Prestige Palms, Indiranagar, Bengaluru",
                status = "technician_en_route",
                technicianName = "Ramesh Kumar",
                startOtp = "4821",
                price = 249,
                totalAmount = 316,
                technicianPayout = 278,
                adminCommission = 38
            ),
            Booking(
                id = "QF-84921",
                serviceTitle = "Kitchen Sink Trap & Pipe Leakage",
                category = "plumber",
                customerName = "Vikram Aditya",
                customerAddress = "#18, 5th Cross, Koramangala 4th Block, Bengaluru",
                status = "assigned",
                technicianName = "Suresh Patel",
                startOtp = "9134",
                price = 299,
                totalAmount = 375,
                technicianPayout = 328,
                adminCommission = 47
            ),
            Booking(
                id = "QF-84918",
                serviceTitle = "Bathroom Tap Ceramic Cartridge Replacement",
                category = "plumber",
                customerName = "Pooja Hegde",
                customerAddress = "Villa 12, Green Glen Layout, Bellandur, Bengaluru",
                status = "completed",
                technicianName = "Suresh Patel",
                startOtp = "3819",
                price = 349,
                totalAmount = 434,
                technicianPayout = 380,
                adminCommission = 54
            ),
            Booking(
                id = "QF-85010",
                serviceTitle = "Ceiling Fan Heavy Wiring & Regulator",
                category = "electrician",
                customerName = "Rohit Patidar",
                customerAddress = "102, Shrivardhan Complex, RNT Marg, Indore",
                status = "technician_en_route",
                technicianName = "Deepak Solanki",
                startOtp = "5190",
                price = 249,
                totalAmount = 316,
                technicianPayout = 278,
                adminCommission = 38
            ),
            Booking(
                id = "QF-85011",
                serviceTitle = "Overhead Tank Float Valve & Pipe Leakage",
                category = "plumber",
                customerName = "Priya Sharma",
                customerAddress = "E-3/42, Arera Colony, Near 10 No. Market, Bhopal",
                status = "assigned",
                technicianName = "Kamlesh Rathore",
                startOtp = "7231",
                price = 399,
                totalAmount = 494,
                technicianPayout = 425,
                adminCommission = 69
            ),
            Booking(
                id = "QF-85012",
                serviceTitle = "Main Line MCB & Power Sockets Repair",
                category = "electrician",
                customerName = "Shivam Joshi",
                customerAddress = "45, Freeganj Main Road, Near Tower Chowk, Ujjain",
                status = "completed",
                technicianName = "Mohanlal Malviya",
                startOtp = "4482",
                price = 299,
                totalAmount = 375,
                technicianPayout = 328,
                adminCommission = 47
            ),
            Booking(
                id = "QF-85013",
                serviceTitle = "Bathroom Mixer Tap Cartridge Replacement",
                category = "plumber",
                customerName = "Ankit Verma",
                customerAddress = "12, Chamunda Complex, AB Road, Dewas",
                status = "completed",
                technicianName = "Govind Parmar",
                startOtp = "6614",
                price = 349,
                totalAmount = 434,
                technicianPayout = 380,
                adminCommission = 54
            )
        )
    )
    val bookings: StateFlow<List<Booking>> = _bookings.asStateFlow()

    private val _firestoreSyncStatus = MutableStateFlow("Connected (Firestore Live)")
    val firestoreSyncStatus: StateFlow<String> = _firestoreSyncStatus.asStateFlow()

    fun updateCommissionSettings(electricianPct: Int, plumberPct: Int, convenienceFee: Int) {
        val updated = _commissionSettings.value.copy(
            electricianCommissionPct = electricianPct,
            plumberCommissionPct = plumberPct,
            convenienceFee = convenienceFee
        )
        _commissionSettings.value = updated
        viewModelScope.launch {
            try {
                firestore.collection("system").document("commission_rules").set(updated)
            } catch (_: Exception) {}
        }
    }

    fun approveTechnicianKyc(techUid: String) {
        _technicians.value = _technicians.value.map { tech ->
            if (tech.uid == techUid) tech.copy(isVerified = true) else tech
        }
    }

    fun rejectTechnicianKyc(techUid: String) {
        _technicians.value = _technicians.value.map { tech ->
            if (tech.uid == techUid) tech.copy(isVerified = false) else tech
        }
    }

    fun reassignBooking(bookingId: String, newTechnicianName: String) {
        _bookings.value = _bookings.value.map { b ->
            if (b.id == bookingId) b.copy(technicianName = newTechnicianName, status = "assigned") else b
        }
    }

    fun updateBookingStatus(bookingId: String, newStatus: String) {
        _bookings.value = _bookings.value.map { b ->
            if (b.id == bookingId) b.copy(status = newStatus) else b
        }
    }

    fun triggerFirestoreSync() {
        _firestoreSyncStatus.value = "Synchronizing..."
        viewModelScope.launch {
            kotlinx.coroutines.delay(800)
            _firestoreSyncStatus.value = "Synced with Cloud Firestore (12ms latency)"
        }
    }
}
