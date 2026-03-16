package com.example.chatapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chatapp.repository.MessageRepo;
import com.example.chatapp.dto.MessageDTO;
import com.example.chatapp.model.Message;

@Service
public class MessageService {
    @Autowired
    private MessageRepo messageRepo;

    public ArrayList<MessageDTO> getMessagesByRoom(String roomId) {
        ArrayList<Message> messages = messageRepo.findMessagesByRoom(roomId);
        ArrayList<MessageDTO> messageDTOs = new ArrayList<>();

        for (Message message : messages) {
            messageDTOs.add(new MessageDTO(message.getUser().getUserId(), message.getRoom().getRoomId(), message.getUser().getUserName(),
                    message.getContent(), message.getCreatedAt(), message.getType()));
        }
        return messageDTOs;
    }

    public void saveMessage(MessageDTO message) {
        message.setCreatedAt(LocalDateTime.now());
        messageRepo.saveMessage(message.getUserId(), message.getRoomId(), message.getContent(), message.getCreatedAt(), message.getType());
    }
}
