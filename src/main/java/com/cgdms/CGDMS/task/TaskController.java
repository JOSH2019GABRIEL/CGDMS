package com.cgdms.CGDMS.task;


import com.cgdms.CGDMS.batch.BatchResponse;
import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("task-assignment")
@Tag(name = "Task Assignment")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request, Authentication connectedUser) {
        return ResponseEntity.ok(taskService.createTask(request, connectedUser));
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                   @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<TaskResponse>> findAllBatch(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(taskService.getAllTasks(page, size));
    }

    @PutMapping("/{id}/archive")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> archiveTask(@PathVariable Long id) {
        taskService.archiveTask(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<TaskResponse>> getTasksForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getTasksForUser(userId));
    }

    //TODO: Add pagination for user assigned task
}
