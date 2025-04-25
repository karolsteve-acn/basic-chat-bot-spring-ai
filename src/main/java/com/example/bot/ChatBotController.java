package com.example.bot;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

/**
 * Author: karol.s.tchatchouang
 * Project: bot
 * Created 4/25/2025 at 1:14 PM
 */

@RestController
public class ChatBotController {

    private final ChatClient chatClient;

    public ChatBotController(ChatClient.Builder builder) {
        this.chatClient = builder
                .defaultSystem("""
                        When answering. always give the answer in Mauritian creole""")
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }


    @GetMapping("/chat")
    public Flux<String> chat(@RequestParam String prompt) {
        return chatClient.prompt()
                .user(prompt)
                .stream()
                .content();
    }
}
