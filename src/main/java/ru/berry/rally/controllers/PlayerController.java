package ru.berry.rally.controllers;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.berry.rally.entities.PlayerEntity;
import ru.berry.rally.repositories.PlayerRepository;

import java.util.List;

@RestController
@RequestMapping("player")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final Logger log;

    @Autowired
    public PlayerController(PlayerRepository playerRepository, Logger log) {
        this.playerRepository = playerRepository;
        this.log = log;
    }

    @GetMapping("get-all")
    public List<PlayerEntity> getAll(){
        log.info("Requested all players");
        return playerRepository.findAll();
    }

    @PostMapping("add")
    public void add(@RequestParam(value = "name") String name,
                      @RequestParam(value = "surname") String surname){
        log.info("Adding new player: " + name + " " + surname);
        playerRepository.save(new PlayerEntity(name, surname));
    }

    @PostMapping("remove")
    public void remove(@RequestParam(value = "id") Long id){
        log.info("Removing player. ID: " + id);
        playerRepository.deleteById(id);
    }

    @PostMapping("test")
    public String test(@RequestParam(value = "string") String string){
        playerRepository.save(new PlayerEntity("name", "surname"));
//        playerRepository.deleteById(temp.getId());

        return "completed '" + string + "'";
    }

    @PostMapping("remove-all")
    public void removeAll(){
        log.info("DELETE ALL");
        playerRepository.deleteAll();
    }
}
