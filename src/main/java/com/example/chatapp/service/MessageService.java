package com.example.chatapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.chatapp.repository.MessageRepo;
import com.example.chatapp.dto.MessageDTO;
import com.example.chatapp.model.Message;

@Service
public class MessageService {
    @Autowired
    private MessageRepo messageRepo;

    public List<MessageDTO> getMessagesByRoom(String roomId, int index) {
        Pageable pageable = PageRequest.of(index, 10,
                Sort.by(Sort.Order.desc("createdAt")));
                
        Page<Message> pagingMessage = messageRepo.findMessagesByRoom(roomId, pageable);
        List<Message> messages = pagingMessage.getContent();
        List<MessageDTO> messageDTOs = new ArrayList<>();

        for (Message message : messages) {
            messageDTOs.add(new MessageDTO(message.getUser().getUserId(), message.getRoom().getRoomId(),
                    message.getUser().getUserName(),
                    message.getContent(), message.getCreatedAt(), message.getType(), message.getFileName()));
        }
        return messageDTOs;
    }

    public void saveMessage(MessageDTO message) {
        message.setCreatedAt(LocalDateTime.now());
        messageRepo.saveMessage(message.getUserId(), message.getRoomId(), message.getContent(), message.getCreatedAt(),
                message.getType(), message.getFileName());
    }
}
