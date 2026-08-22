package com.whatthemic.backend.repository;

import com.whatthemic.backend.entity.TicketBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketBookingRepository extends JpaRepository<TicketBooking, Long> {
    List<TicketBooking> findByEventId(Long eventId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM TicketBooking t WHERE t.event.id = :eventId")
    void deleteByEventId(@org.springframework.data.repository.query.Param("eventId") Long eventId);
}
