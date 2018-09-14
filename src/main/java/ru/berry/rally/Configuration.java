package ru.berry.rally;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@org.springframework.context.annotation.Configuration
@ComponentScan
public class Configuration {

    @Bean
    public Logger logger(){
        return LoggerFactory.getLogger("Debug");
    }

}
