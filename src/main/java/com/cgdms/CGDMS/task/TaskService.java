package com.cgdms.CGDMS.task;

import com.cgdms.CGDMS.common.PageResponse;
import com.cgdms.CGDMS.user.User;
import com.cgdms.CGDMS.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskMapperService taskMapper;

    public TaskResponse createTask(TaskRequest request, Authentication connectedUser) {
        User loggedInUser = ((User) connectedUser.getPrincipal());

        User assignedUser = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .assignedTo(assignedUser)
                .assignedBy(loggedInUser)
                .archived(0)
                .build();

        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            task.setAssignedTo(user);
        }

        Task updated = taskRepository.save(task);
        return taskMapper.toResponse(updated);
    }

    public void archiveTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        task.setArchived(1);
        taskRepository.save(task);
    }

    public List<TaskResponse> getTasksForUser(Long userId) {
        return taskRepository.findByAssignedToId(userId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    public PageResponse<TaskResponse> getAllTasks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<Task> tasks = taskRepository.findAllTask(pageable);

        List<TaskResponse> taskResponses = tasks.stream()
                .map(taskMapper::toResponse)
                .toList();

        return new PageResponse<>(
                taskResponses,
                tasks.getNumber(),
                tasks.getSize(),
                tasks.getTotalElements(),
                tasks.getTotalPages(),
                tasks.isFirst(),
                tasks.isLast()
        );
    }


//    private TaskResponse toResponse(Task task) {
//        return TaskResponse.builder()
//                .id(task.getId())
//                .title(task.getTitle())
//                .description(task.getDescription())
//                .dueDate(task.getDueDate())
//                .assignedTo(task.getAssignedTo() != null ? task.getAssignedTo().getEmail() : null)
////                .createdBy(task.getCreatedBy() != null ? task.getCreatedBy().getEmail() : null)
//                .archived(task.getArchived())
//                .build();
//    }
}