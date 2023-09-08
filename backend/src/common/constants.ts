enum AppointmentStatus {
    SCHEDULED,
    COMPLETED,
    CANCELLED,
    RESCHEDULED
}

enum BarberAvailability {
    AVAILABLE,
    UNAVAILABLE,
    ON_BREAK
}

enum NotificationPreference {
    EMAIL,
    SMS,
    PUSH_NOTIFICATION
}

export {
    AppointmentStatus,
    BarberAvailability,
    NotificationPreference
}