package com.whatthemic.backend.repository;

import com.whatthemic.backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByEventId(Long eventId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM TicketType t WHERE t.event.id = :eventId")
    void deleteByEventId(@org.springframework.data.repository.query.Param("eventId") Long eventId);
}
