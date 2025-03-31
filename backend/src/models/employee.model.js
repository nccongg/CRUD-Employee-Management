const mongoose = require('mongoose');

// Schema cho lịch sử chấm công
const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['check-in', 'check-out'],
        required: true
    },
    time: {
        type: Date,
        required: true
    }
}, { _id: false });

// Schema cho lịch sử nghỉ phép
const leaveHistorySchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['annual', 'sick', 'unpaid', 'other'],
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        index: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now
    },
    position: {
        type: String,
        required: [true, 'Position is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations']
    },
    salary: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'VND'
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active'
    },
    workingDays: {
        type: Number,
        required: true,
        default: 0
    },
    leaveBalance: {
        annual: {
            type: Number,
            default: 12 // 12 ngày phép một năm
        },
        sick: {
            type: Number,
            default: 30 // 30 ngày phép bệnh một năm
        },
        used: {
            type: Number,
            default: 0
        }
    },
    attendance: [attendanceSchema],
    leaveHistory: [leaveHistorySchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Middleware để tự động cập nhật workingDays và lastUpdated
employeeSchema.pre('save', function(next) {
    const now = new Date();
    
    // Cập nhật workingDays
    if (this.status === 'active') {
        const startDate = this.startDate;
        const diffTime = Math.abs(now - startDate);
        const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Trừ đi số ngày nghỉ đã sử dụng
        this.workingDays = totalDays - this.leaveBalance.used;
    }
    
    // Cập nhật lastUpdated
    this.lastUpdated = now;
    next();
});

// Method để xin nghỉ phép
employeeSchema.methods.requestLeave = async function(startDate, endDate, reason, type) {
    // Tính số ngày xin nghỉ
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Kiểm tra số ngày phép còn lại
    if (type === 'annual' && daysRequested > this.leaveBalance.annual) {
        throw new Error('Insufficient annual leave balance');
    } else if (type === 'sick' && daysRequested > this.leaveBalance.sick) {
        throw new Error('Insufficient sick leave balance');
    }
    
    // Thêm vào lịch sử nghỉ phép
    this.leaveHistory.push({
        startDate,
        endDate,
        reason,
        type,
        status: 'pending'
    });
    
    await this.save();
};

// Method để chấm công
employeeSchema.methods.clockInOut = async function(type) {
    const now = new Date();
    this.attendance.push({
        date: now,
        type,
        time: now
    });
    
    await this.save();
};

// Method để thống kê nghỉ phép theo loại và trạng thái
employeeSchema.methods.getLeaveStatistics = function(startDate, endDate) {
    const leaves = this.leaveHistory.filter(leave => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return leaveStart >= new Date(startDate) && leaveEnd <= new Date(endDate);
    });

    const statistics = {
        total: leaves.length,
        byType: {
            annual: {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                days: 0
            },
            sick: {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                days: 0
            },
            unpaid: {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                days: 0
            },
            other: {
                total: 0,
                approved: 0,
                pending: 0,
                rejected: 0,
                days: 0
            }
        },
        byStatus: {
            approved: 0,
            pending: 0,
            rejected: 0
        }
    };

    leaves.forEach(leave => {
        // Thống kê theo loại
        statistics.byType[leave.type].total++;
        statistics.byType[leave.type][leave.status]++;
        statistics.byType[leave.type].days += leave.numberOfDays;

        // Thống kê theo trạng thái
        statistics.byStatus[leave.status]++;
    });

    return statistics;
};

// Method để lấy báo cáo chấm công theo tháng
employeeSchema.methods.getMonthlyAttendanceReport = function(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = this.attendance.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
    });

    const report = {
        year,
        month,
        totalDays: endDate.getDate(),
        workingDays: 0,
        attendance: {},
        summary: {
            present: 0,
            absent: 0,
            late: 0,
            earlyLeave: 0
        }
    };

    // Nhóm các records theo ngày
    attendanceRecords.forEach(record => {
        const date = new Date(record.date).toISOString().split('T')[0];
        if (!report.attendance[date]) {
            report.attendance[date] = {
                checkIn: null,
                checkOut: null,
                status: 'absent'
            };
        }

        if (record.type === 'check-in') {
            report.attendance[date].checkIn = record.time;
            // Kiểm tra đi muộn (sau 9:00)
            const hour = new Date(record.time).getHours();
            if (hour >= 9) {
                report.summary.late++;
            }
        } else {
            report.attendance[date].checkOut = record.time;
            // Kiểm tra về sớm (trước 17:00)
            const hour = new Date(record.time).getHours();
            if (hour < 17) {
                report.summary.earlyLeave++;
            }
        }

        if (report.attendance[date].checkIn && report.attendance[date].checkOut) {
            report.attendance[date].status = 'present';
            report.summary.present++;
        }
    });

    // Tính số ngày vắng mặt
    report.summary.absent = report.totalDays - report.summary.present;

    return report;
};

// Method để lấy báo cáo tổng hợp (cả chấm công và nghỉ phép)
employeeSchema.methods.getCompleteReport = async function(year, month) {
    const attendanceReport = this.getMonthlyAttendanceReport(year, month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const leaveStats = this.getLeaveStatistics(startDate, endDate);

    return {
        employeeInfo: {
            name: this.name,
            department: this.department,
            position: this.position
        },
        attendance: attendanceReport,
        leaves: leaveStats,
        summary: {
            workingDays: attendanceReport.summary.present,
            leaveDays: leaveStats.byStatus.approved,
            absentDays: attendanceReport.summary.absent - leaveStats.byStatus.approved,
            lateCount: attendanceReport.summary.late,
            earlyLeaveCount: attendanceReport.summary.earlyLeave
        }
    };
};

// Text index cho tìm kiếm
employeeSchema.index({ 
    name: 'text', 
    email: 'text', 
    phone: 'text', 
    position: 'text',
    department: 'text'
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee; 