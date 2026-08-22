package com.whatthemic.backend.controller;

import com.whatthemic.backend.entity.ArtistLead;
import com.whatthemic.backend.entity.LeadStatus;
import com.whatthemic.backend.entity.User;
import com.whatthemic.backend.repository.ArtistLeadRepository;
import com.whatthemic.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HostController {

    @Autowired
    private ArtistLeadRepository artistLeadRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String pass = creds.get("password");
        User host = userRepository.findByUsername("host").orElse(null);
        if (host != null && passwordEncoder.matches(pass, host.getPassword())) {
            return ResponseEntity.ok(Map.of("success", true, "token", "host-auth-token-xyz"));
        }
        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials"));
    }

    @GetMapping("/stage-leads")
    public List<ArtistLead> getStageLeads() {
        return artistLeadRepository.findByStatusOrderByLineupOrderAsc(LeadStatus.STAGE_READY);
    }

    @GetMapping("/lineup/{eventId}")
    public List<ArtistLead> getLineup(@PathVariable Long eventId) {
        return artistLeadRepository.findByEventIdOrderByLineupOrderAsc(eventId);
    }

    @PutMapping("/leads/reorder")
    public void reorderStageLeads(@RequestBody List<Long> leadIds) {
        // leadIds is the ordered list of IDs
        for (int i = 0; i < leadIds.size(); i++) {
            ArtistLead lead = artistLeadRepository.findById(leadIds.get(i)).orElseThrow();
            lead.setLineupOrder(i);
            artistLeadRepository.save(lead);
        }
    }
}
