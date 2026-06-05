package com.billsplitter.bill_splitter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createGroup(@RequestBody GroupRequest request) {
        User creator = userRepository.findById(request.getCreatedById())
                .orElse(null);
        if (creator == null) return ResponseEntity.badRequest().body("User not found!");

        List<User> members = userRepository.findAllById(request.getMemberIds());
        if (!members.contains(creator)) members.add(creator);

        Group group = new Group();
        group.setName(request.getName());
        group.setCreatedBy(creator);
        group.setMembers(members);

        return ResponseEntity.ok(groupRepository.save(group));
    }

    @GetMapping("/user/{userId}")
    public List<Group> getMyGroups(@PathVariable Long userId) {
        return groupRepository.findByCreatedById(userId);
    }
}