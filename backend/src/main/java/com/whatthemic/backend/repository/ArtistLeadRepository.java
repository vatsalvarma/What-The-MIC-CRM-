package com.whatthemic.backend.repository;

import com.whatthemic.backend.entity.ArtistLead;
import com.whatthemic.backend.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArtistLeadRepository extends JpaRepository<ArtistLead, Long> {
    List<ArtistLead> findByEventId(Long eventId);
    List<ArtistLead> findByEventIdOrderByLineupOrderAsc(Long eventId);
    List<ArtistLead> findByStatusOrderByLineupOrderAsc(LeadStatus status);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ArtistLead a WHERE a.event.id = :eventId")
    void deleteByEventId(@org.springframework.data.repository.query.Param("eventId") Long eventId);
}
