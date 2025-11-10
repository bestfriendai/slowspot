using Microsoft.EntityFrameworkCore;
using SlowSpot.Api.Models;

namespace SlowSpot.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Quote> Quotes { get; set; }
    public DbSet<MeditationSession> MeditationSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed initial data - Quotes (50+ quotes, multiple languages)
        modelBuilder.Entity<Quote>().HasData(
            // English Quotes
            new Quote { Id = 1, Text = "Peace comes when you stop chasing it.", LanguageCode = "en", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 2, Text = "The present moment is all you ever have.", Author = "Eckhart Tolle", LanguageCode = "en", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 3, Text = "Meditation is not about stopping thoughts, but recognizing them.", LanguageCode = "en", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 4, Text = "Be still. Listen to the stones. They know patience.", LanguageCode = "en", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 5, Text = "The quieter you become, the more you can hear.", Author = "Ram Dass", LanguageCode = "en", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 6, Text = "You cannot stop the waves, but you can learn to surf.", Author = "Jon Kabat-Zinn", LanguageCode = "en", CultureTag = "mindfulness", Category = "acceptance", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 7, Text = "Breathing in, I calm my body. Breathing out, I smile.", Author = "Thich Nhat Hanh", LanguageCode = "en", CultureTag = "mindfulness", Category = "breath", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 8, Text = "The journey of a thousand miles begins with one breath.", LanguageCode = "en", CultureTag = "zen", Category = "journey", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 9, Text = "In stillness, everything is possible.", LanguageCode = "en", CultureTag = "universal", Category = "stillness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 10, Text = "Let go of what has passed. Let go of what may come. Let go of what is happening now.", Author = "Buddha", LanguageCode = "en", CultureTag = "zen_buddhist", Category = "letting_go", CreatedAt = DateTime.UtcNow },

            // Polish Quotes
            new Quote { Id = 11, Text = "Spokój przychodzi, gdy przestajesz go gonić.", LanguageCode = "pl", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 12, Text = "Obecna chwila to wszystko, co kiedykolwiek masz.", Author = "Eckhart Tolle", LanguageCode = "pl", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 13, Text = "Medytacja to nie zatrzymywanie myśli, ale ich rozpoznawanie.", LanguageCode = "pl", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 14, Text = "Bądź cicho. Słuchaj kamieni. Znają cierpliwość.", LanguageCode = "pl", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 15, Text = "Im cichszy się stajesz, tym więcej możesz usłyszeć.", Author = "Ram Dass", LanguageCode = "pl", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 16, Text = "Nie możesz zatrzymać fal, ale możesz nauczyć się surfować.", Author = "Jon Kabat-Zinn", LanguageCode = "pl", CultureTag = "mindfulness", Category = "acceptance", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 17, Text = "Wdychając, uspokajam ciało. Wydychając, uśmiecham się.", Author = "Thich Nhat Hanh", LanguageCode = "pl", CultureTag = "mindfulness", Category = "breath", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 18, Text = "Podróż tysiąca mil zaczyna się od jednego oddechu.", LanguageCode = "pl", CultureTag = "zen", Category = "journey", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 19, Text = "W ciszy wszystko jest możliwe.", LanguageCode = "pl", CultureTag = "universal", Category = "stillness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 20, Text = "Puść to, co minęło. Puść to, co nadejdzie. Puść to, co dzieje się teraz.", Author = "Budda", LanguageCode = "pl", CultureTag = "zen_buddhist", Category = "letting_go", CreatedAt = DateTime.UtcNow },

            // Spanish Quotes
            new Quote { Id = 21, Text = "La paz viene cuando dejas de perseguirla.", LanguageCode = "es", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 22, Text = "El momento presente es todo lo que tienes.", Author = "Eckhart Tolle", LanguageCode = "es", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 23, Text = "La meditación no trata de detener pensamientos, sino de reconocerlos.", LanguageCode = "es", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 24, Text = "Quédate quieto. Escucha las piedras. Conocen la paciencia.", LanguageCode = "es", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 25, Text = "Cuanto más tranquilo te vuelves, más puedes escuchar.", Author = "Ram Dass", LanguageCode = "es", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },

            // German Quotes
            new Quote { Id = 26, Text = "Frieden kommt, wenn du aufhörst, ihn zu jagen.", LanguageCode = "de", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 27, Text = "Der gegenwärtige Moment ist alles, was du jemals hast.", Author = "Eckhart Tolle", LanguageCode = "de", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 28, Text = "Meditation bedeutet nicht, Gedanken zu stoppen, sondern sie zu erkennen.", LanguageCode = "de", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 29, Text = "Sei still. Höre den Steinen zu. Sie kennen Geduld.", LanguageCode = "de", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 30, Text = "Je ruhiger du wirst, desto mehr kannst du hören.", Author = "Ram Dass", LanguageCode = "de", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },

            // French Quotes
            new Quote { Id = 31, Text = "La paix vient quand tu arrêtes de la poursuivre.", LanguageCode = "fr", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 32, Text = "Le moment présent est tout ce que tu as jamais.", Author = "Eckhart Tolle", LanguageCode = "fr", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 33, Text = "La méditation ne consiste pas à arrêter les pensées, mais à les reconnaître.", LanguageCode = "fr", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 34, Text = "Reste tranquille. Écoute les pierres. Elles connaissent la patience.", LanguageCode = "fr", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 35, Text = "Plus tu deviens calme, plus tu peux entendre.", Author = "Ram Dass", LanguageCode = "fr", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },

            // Hindi Quotes
            new Quote { Id = 36, Text = "शांति तब आती है जब आप इसका पीछा करना बंद कर देते हैं।", LanguageCode = "hi", CultureTag = "universal", Category = "peace", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 37, Text = "वर्तमान क्षण वह सब है जो आपके पास कभी है।", Author = "एकहार्ट टोले", LanguageCode = "hi", CultureTag = "mindfulness", Category = "presence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 38, Text = "ध्यान विचारों को रोकने के बारे में नहीं, बल्कि उन्हें पहचानने के बारे में है।", LanguageCode = "hi", CultureTag = "zen", Category = "awareness", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 39, Text = "शांत रहो। पत्थरों को सुनो। वे धैर्य जानते हैं।", LanguageCode = "hi", CultureTag = "zen", Category = "patience", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 40, Text = "जितने शांत आप होते हैं, उतना अधिक आप सुन सकते हैं।", Author = "राम दास", LanguageCode = "hi", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },

            // Additional Universal Quotes
            new Quote { Id = 41, Text = "Silence is the language of the cosmos.", LanguageCode = "en", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 42, Text = "Your calm mind is the ultimate weapon against your challenges.", LanguageCode = "en", CultureTag = "universal", Category = "calm", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 43, Text = "Meditation brings wisdom; lack of meditation leaves ignorance.", Author = "Buddha", LanguageCode = "en", CultureTag = "zen_buddhist", Category = "wisdom", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 44, Text = "Walk as if you are kissing the Earth with your feet.", Author = "Thich Nhat Hanh", LanguageCode = "en", CultureTag = "mindfulness", Category = "walking", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 45, Text = "The mind is everything. What you think, you become.", Author = "Buddha", LanguageCode = "en", CultureTag = "zen_buddhist", Category = "mind", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 46, Text = "Cisza jest językiem kosmosu.", LanguageCode = "pl", CultureTag = "universal", Category = "silence", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 47, Text = "Twój spokojny umysł to najlepsza broń przeciw twoim wyzwaniom.", LanguageCode = "pl", CultureTag = "universal", Category = "calm", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 48, Text = "Medytacja przynosi mądrość; brak medytacji pozostawia ignorancję.", Author = "Budda", LanguageCode = "pl", CultureTag = "zen_buddhist", Category = "wisdom", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 49, Text = "Idź tak, jakbyś całował Ziemię swoimi stopami.", Author = "Thich Nhat Hanh", LanguageCode = "pl", CultureTag = "mindfulness", Category = "walking", CreatedAt = DateTime.UtcNow },
            new Quote { Id = 50, Text = "Umysł jest wszystkim. Czym myślisz, tym się stajesz.", Author = "Budda", LanguageCode = "pl", CultureTag = "zen_buddhist", Category = "mind", CreatedAt = DateTime.UtcNow }
        );

        // Meditation Sessions (30+ sessions, multiple languages, all 5 levels)
        modelBuilder.Entity<MeditationSession>().HasData(
            // English Sessions - Level 1 (Beginner)
            new MeditationSession { Id = 1, Title = "Breath Awareness", LanguageCode = "en", DurationSeconds = 300, Level = 1, Description = "A simple 5-minute breath awareness meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 2, Title = "Body Scan Basics", LanguageCode = "en", DurationSeconds = 480, Level = 1, Description = "Introduction to body awareness", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 3, Title = "Zen Breathing", LanguageCode = "en", DurationSeconds = 420, Level = 1, Description = "Simple Zen breathing practice", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 2 (Intermediate)
            new MeditationSession { Id = 4, Title = "Mindful Observation", LanguageCode = "en", DurationSeconds = 600, Level = 2, Description = "10-minute observation meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 5, Title = "Walking Meditation", LanguageCode = "en", DurationSeconds = 720, Level = 2, Description = "Meditative walking practice", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 3 (Advanced)
            new MeditationSession { Id = 6, Title = "Deep Vipassana", LanguageCode = "en", DurationSeconds = 900, Level = 3, Description = "15-minute insight meditation", CultureTag = "vipassana", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 7, Title = "Loving Kindness", LanguageCode = "en", DurationSeconds = 1080, Level = 3, Description = "Metta meditation practice", CultureTag = "zen_buddhist", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 4 (Expert)
            new MeditationSession { Id = 8, Title = "Silent Meditation", LanguageCode = "en", DurationSeconds = 1200, Level = 4, Description = "20-minute silent sitting", CultureTag = "zen", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 9, Title = "Transcendental Practice", LanguageCode = "en", DurationSeconds = 1500, Level = 4, Description = "Deep transcendental meditation", CultureTag = "transcendental", CreatedAt = DateTime.UtcNow },

            // English Sessions - Level 5 (Master)
            new MeditationSession { Id = 10, Title = "Extended Zazen", LanguageCode = "en", DurationSeconds = 1800, Level = 5, Description = "30-minute Zen sitting", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 1
            new MeditationSession { Id = 11, Title = "Świadomość Oddechu", LanguageCode = "pl", DurationSeconds = 300, Level = 1, Description = "Prosta 5-minutowa medytacja świadomości oddechu", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 12, Title = "Podstawowy Skan Ciała", LanguageCode = "pl", DurationSeconds = 480, Level = 1, Description = "Wprowadzenie do świadomości ciała", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 13, Title = "Oddychanie Zen", LanguageCode = "pl", DurationSeconds = 420, Level = 1, Description = "Prosta praktyka oddychania Zen", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 2
            new MeditationSession { Id = 14, Title = "Uważna Obserwacja", LanguageCode = "pl", DurationSeconds = 600, Level = 2, Description = "10-minutowa medytacja obserwacji", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 15, Title = "Medytacja w Ruchu", LanguageCode = "pl", DurationSeconds = 720, Level = 2, Description = "Praktyka medytacyjnego chodzenia", CultureTag = "zen", CreatedAt = DateTime.UtcNow },

            // Polish Sessions - Level 3
            new MeditationSession { Id = 16, Title = "Głęboka Vipassana", LanguageCode = "pl", DurationSeconds = 900, Level = 3, Description = "15-minutowa medytacja wglądu", CultureTag = "vipassana", CreatedAt = DateTime.UtcNow },

            // Spanish Sessions - Level 1
            new MeditationSession { Id = 17, Title = "Conciencia de la Respiración", LanguageCode = "es", DurationSeconds = 300, Level = 1, Description = "Meditación simple de 5 minutos", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 18, Title = "Escaneo Corporal Básico", LanguageCode = "es", DurationSeconds = 480, Level = 1, Description = "Introducción a la conciencia corporal", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Spanish Sessions - Level 2
            new MeditationSession { Id = 19, Title = "Observación Consciente", LanguageCode = "es", DurationSeconds = 600, Level = 2, Description = "Meditación de observación de 10 minutos", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // German Sessions - Level 1
            new MeditationSession { Id = 20, Title = "Atembewusstsein", LanguageCode = "de", DurationSeconds = 300, Level = 1, Description = "Einfache 5-minütige Atemmeditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 21, Title = "Grundlegender Bodyscan", LanguageCode = "de", DurationSeconds = 480, Level = 1, Description = "Einführung in die Körperwahrnehmung", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // German Sessions - Level 2
            new MeditationSession { Id = 22, Title = "Achtsame Beobachtung", LanguageCode = "de", DurationSeconds = 600, Level = 2, Description = "10-minütige Beobachtungsmeditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // French Sessions - Level 1
            new MeditationSession { Id = 23, Title = "Conscience de la Respiration", LanguageCode = "fr", DurationSeconds = 300, Level = 1, Description = "Méditation simple de 5 minutes", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 24, Title = "Scan Corporel de Base", LanguageCode = "fr", DurationSeconds = 480, Level = 1, Description = "Introduction à la conscience corporelle", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // French Sessions - Level 2
            new MeditationSession { Id = 25, Title = "Observation Consciente", LanguageCode = "fr", DurationSeconds = 600, Level = 2, Description = "Méditation d'observation de 10 minutes", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Hindi Sessions - Level 1
            new MeditationSession { Id = 26, Title = "श्वास जागरूकता", LanguageCode = "hi", DurationSeconds = 300, Level = 1, Description = "सरल 5 मिनट का श्वास ध्यान", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 27, Title = "मूल शरीर स्कैन", LanguageCode = "hi", DurationSeconds = 480, Level = 1, Description = "शरीर जागरूकता का परिचय", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Hindi Sessions - Level 2
            new MeditationSession { Id = 28, Title = "सावधान अवलोकन", LanguageCode = "hi", DurationSeconds = 600, Level = 2, Description = "10 मिनट का अवलोकन ध्यान", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow },

            // Universal Sessions (English) - Mixed Levels
            new MeditationSession { Id = 29, Title = "Quick Reset", LanguageCode = "en", DurationSeconds = 180, Level = 1, Description = "3-minute quick meditation for busy days", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 30, Title = "Evening Calm", LanguageCode = "en", DurationSeconds = 900, Level = 3, Description = "15-minute evening relaxation", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 31, Title = "Morning Energy", LanguageCode = "en", DurationSeconds = 600, Level = 2, Description = "10-minute energizing morning practice", CultureTag = "universal", CreatedAt = DateTime.UtcNow },
            new MeditationSession { Id = 32, Title = "Stress Relief", LanguageCode = "en", DurationSeconds = 720, Level = 2, Description = "12-minute stress reduction meditation", CultureTag = "mindfulness", CreatedAt = DateTime.UtcNow }
        );
    }
}
