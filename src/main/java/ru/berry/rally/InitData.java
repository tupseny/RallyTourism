package ru.berry.rally;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.berry.rally.entities.PlayerEntity;
import ru.berry.rally.repositories.PlayerRepository;

import javax.annotation.PostConstruct;
import java.util.*;

@Component
public class InitData {

//    num of entries
    private final int count = 100;

    private final Logger log;

    PlayerRepository playerRepository;

    @Autowired
    public InitData(Logger log, PlayerRepository playerRepository) {
        this.log = log;
        this.playerRepository = playerRepository;
    }

    @PostConstruct
    public void init(){
        String name, surname;
        ArrayList<PlayerEntity> players = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            name = RandomPlayerName.getName();
            surname = RandomPlayerSurname.getName();

            players.add(new PlayerEntity(name, surname));
        }

        log.info("Inserting test data...");
        playerRepository.saveAll(players);

        StringBuilder builder = new StringBuilder();
        playerRepository.findAll().forEach(playerEntity -> {
            builder.append("player: ");
            builder.append(playerEntity.toString());
            builder.append("\n");
        });
        log.info(builder.toString());
    }

    enum RandomPlayerName{
        MADELYN, MAKAYA, KHLOE, AYDEN, LINNETT, WINTER, SAM, POPPY, OLIVIA, NAVA, ZABI, WYN;

        private static final List<RandomPlayerName> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
        private static final int SIZE = VALUES.size();
        private static final Random RANDOM = new Random();

        public static String getName(){
            return VALUES.get(RANDOM.nextInt(SIZE)).name();
        }
    }

    enum RandomPlayerSurname{
        AARON, ABEL, ALLRED, ROSA, ARNDT, ARTHUR, ADAMUS, ACUNA, ADKINS, RALEY, RICCI, RICE, KATZ;

        private static final List<RandomPlayerSurname> VALUES = Collections.unmodifiableList(Arrays.asList(values()));
        private static final int SIZE = VALUES.size();
        private static final Random RANDOM = new Random();

        public static String getName(){
            return VALUES.get(RANDOM.nextInt(SIZE)).name();
        }
    }
}
