package com.whatthemic.backend.repository;

import com.whatthemic.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByClosedFalseOrderByIdDesc();
    List<Event> findAllByOrderByIdDesc();
}
