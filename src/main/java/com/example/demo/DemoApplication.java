package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(ProductoRepository repository) {
		return args -> {
			repository.save(new Producto("Laptop Pro", "Potente laptop para desarrollo", 1200.0, 10, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853", "Computadoras"));
			repository.save(new Producto("Monitor 4K", "Monitor de 27 pulgadas ultra HD", 350.0, 15, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf", "Periféricos"));
			repository.save(new Producto("Teclado Mecánico", "Teclado RGB con switches blue", 85.0, 20, "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae", "Periféricos"));
			repository.save(new Producto("Mouse Gamer", "Mouse ergonómico de 16000 DPI", 45.0, 30, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf", "Periféricos"));
			repository.save(new Producto("Auriculares Noise Cancelling", "Cancelación de ruido activa y 30h de batería", 250.0, 12, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", "Audio"));
			repository.save(new Producto("Silla Gaming", "Ergonómica con soporte lumbar", 180.0, 5, "https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?w=500", "Muebles"));
			repository.save(new Producto("Webcam 1080p", "Ideal para streaming y videollamadas", 65.0, 25, "https://images.unsplash.com/photo-1612454376902-577cd463d008?w=500", "Periféricos"));
			repository.save(new Producto("Micrófono de Condensador", "Calidad de estudio para podcasting", 120.0, 8, "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500", "Audio"));
		};
	}
}
