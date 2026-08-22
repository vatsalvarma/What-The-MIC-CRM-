package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.ArtistLead;
import com.whatthemic.backend.entity.LeadStatus;
import com.whatthemic.backend.entity.Event;
import com.whatthemic.backend.repository.ArtistLeadRepository;
import com.whatthemic.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/leads")
public class PublicLeadController {

    @Autowired
    private ArtistLeadRepository artistLeadRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public ArtistLead submitForm1(@RequestBody ArtistLead lead) {
        lead.setStatus(LeadStatus.PENDING_APPROVAL);
        
        // Temporarily assign to the first event if none is provided
        if (lead.getEvent() == null) {
            Event defaultEvent = eventRepository.findAll().stream().findFirst().orElseGet(() -> {
                Event newEvent = new Event();
                newEvent.setName("Default Event");
                newEvent.setVenue("Default Venue");
                newEvent.setEventDate(java.time.LocalDateTime.now().plusDays(10).toString());
                return eventRepository.save(newEvent);
            });
            lead.setEvent(defaultEvent);
        }
        
        return artistLeadRepository.save(lead);
    }

    @PostMapping("/{id}/form2")
    public ArtistLead submitForm2(@PathVariable Long id, @RequestBody ArtistLead form2Details) {
        ArtistLead lead = artistLeadRepository.findById(id).orElseThrow();
        lead.setSelfIntro(form2Details.getSelfIntro());
        lead.setAudioTrackUrl(form2Details.getAudioTrackUrl());
        if (form2Details.getPhone() != null && !form2Details.getPhone().isEmpty()) {
            lead.setPhone(form2Details.getPhone());
        }
        lead.setStatus(LeadStatus.STAGE_READY);
        return artistLeadRepository.save(lead);
    }
}
