-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: blog_system
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_settings`
--

DROP TABLE IF EXISTS `blog_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_email` varchar(255) NOT NULL,
  `contact` varchar(15) NOT NULL DEFAULT '+91 ',
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `posts_per_page` int DEFAULT '5',
  `allow_comments` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_settings`
--

LOCK TABLES `blog_settings` WRITE;
/*!40000 ALTER TABLE `blog_settings` DISABLE KEYS */;
INSERT INTO `blog_settings` VALUES (1,'support@BlogNest.com','+91 9898887776','Gujarat, India',6,1,'2026-01-15 06:19:01','2026-01-15 06:19:01');
/*!40000 ALTER TABLE `blog_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Technology','2026-01-07 11:21:29','2026-01-07 11:21:29',0),(2,'Eduction','2026-01-07 11:21:53','2026-01-07 11:21:53',0),(3,'Business','2026-01-07 13:40:22','2026-01-07 13:40:22',0),(4,'Travel','2026-01-08 05:57:01','2026-01-08 05:57:01',0),(5,'carrer','2026-01-09 11:27:49','2026-01-09 11:27:49',0),(6,'Food','2026-01-09 11:36:22','2026-01-09 11:36:22',1),(7,'Health','2026-01-09 11:36:54','2026-01-09 11:36:54',0),(8,'Sports','2026-01-09 11:37:06','2026-01-09 11:37:06',0),(9,'nature','2026-01-09 11:37:19','2026-01-09 11:37:19',0),(10,'Personal','2026-01-09 11:39:10','2026-01-09 11:39:10',0),(12,'Life style','2026-01-20 10:31:48','2026-01-20 10:31:48',0),(13,'History','2026-01-21 10:38:31','2026-01-21 10:38:31',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `comment` text NOT NULL,
  `user_id` int unsigned NOT NULL,
  `post_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_approved` int NOT NULL DEFAULT '0',
  `is_delete` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `commments_user_id_foreign` (`user_id`),
  KEY `commments_post_id_foreign` (`post_id`),
  CONSTRAINT `commments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  CONSTRAINT `commments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'nice',9,1,'2026-01-12 05:23:43','2026-01-12 05:23:43',1,0),(2,'excellent',12,5,'2026-01-12 05:23:47','2026-01-12 05:23:47',1,0),(3,'very good',3,3,'2026-01-12 06:26:04','2026-01-12 06:26:04',1,1),(4,'nice',14,8,'2026-01-13 07:58:49','2026-01-13 07:58:49',1,0),(5,'nice',14,3,'2026-01-13 07:59:27','2026-01-13 07:59:27',1,0),(6,'good',14,8,'2026-01-13 09:12:03','2026-01-13 09:12:03',1,1),(7,' great',14,8,'2026-01-13 09:42:02','2026-01-13 09:42:02',1,0),(8,'good',16,3,'2026-01-15 08:02:31','2026-01-15 08:02:31',1,0),(9,'great think',3,3,'2026-01-16 11:45:45','2026-01-16 11:45:45',1,0),(10,'good',15,3,'2026-01-19 11:27:06','2026-01-19 11:27:06',1,0),(11,'supurb onwe',3,3,'2026-01-19 11:28:14','2026-01-19 11:28:14',1,0),(12,'mnbdfbsdb',14,5,'2026-01-19 11:42:52','2026-01-19 11:42:52',1,0),(13,'good',1,8,'2026-01-19 12:02:08','2026-01-19 12:02:08',1,0),(14,'best',10,10,'2026-01-21 12:21:16','2026-01-21 12:21:16',1,0),(15,'nkjnkwen',12,12,'2026-01-21 12:21:40','2026-01-21 12:21:40',1,0),(16,'done',3,12,'2026-01-21 12:21:56','2026-01-21 12:21:56',1,0),(17,'good',12,12,'2026-01-21 12:22:15','2026-01-21 12:22:15',1,0),(18,'bfewf',12,15,'2026-01-22 07:42:49','2026-01-22 07:42:49',0,1),(19,'ndfnkratnkgg',15,14,'2026-01-22 07:43:41','2026-01-22 07:43:41',0,1),(20,'jkhekwkR',1,16,'2026-01-22 07:56:26','2026-01-22 07:56:26',0,1),(21,'ejkhrkwe',10,16,'2026-01-22 08:02:18','2026-01-22 08:02:18',0,1),(22,'good',9,15,'2026-01-22 08:04:53','2026-01-22 08:04:53',1,0),(23,'eafsre',2,16,'2026-01-22 08:05:07','2026-01-22 08:05:07',0,1),(24,'sadnjk',2,16,'2026-01-22 09:09:18','2026-01-22 09:09:18',1,0),(25,'dfnkjaekjf',3,10,'2026-01-22 10:29:16','2026-01-22 10:29:16',1,0),(26,'dnfsjanNKNFDJKNKEKDBKSBKBDKBKBDWQKBSD',3,10,'2026-01-22 10:29:30','2026-01-22 10:29:30',0,1),(27,'nebdbshjhfbdhbfhbbdfhbjfbjbjbjbhbbbncn hbiKUSHEFiuechdsbfhbhj',3,10,'2026-01-22 10:41:56','2026-01-22 10:41:56',0,1),(28,'amnknw',3,3,'2026-01-22 10:42:17','2026-01-22 10:42:17',0,1),(29,'ndbsf',16,18,'2026-01-23 05:55:35','2026-01-23 05:55:35',0,1),(30,'wfejkk',16,18,'2026-01-23 05:58:54','2026-01-23 05:58:54',0,1),(31,'good',16,18,'2026-01-23 06:15:33','2026-01-23 06:15:33',0,0),(32,'jrhkja',16,18,'2026-01-23 06:33:37','2026-01-23 06:33:37',0,0),(33,'jnkjnrkf',16,18,'2026-01-23 06:55:17','2026-01-23 06:55:17',0,1),(34,'excellent',16,14,'2026-01-23 07:37:17','2026-01-23 07:37:17',0,0),(35,'mind bloing',16,15,'2026-01-23 07:38:02','2026-01-23 07:38:02',0,0),(36,'nsdfnewn',2,18,'2026-01-23 07:45:08','2026-01-23 07:45:08',0,0),(37,'best',2,13,'2026-01-23 09:13:46','2026-01-23 09:13:46',0,0),(38,'jdsjkf',2,17,'2026-01-26 07:30:17','2026-01-26 07:30:17',0,0),(39,'jhxs',10,15,'2026-01-28 04:53:27','2026-01-28 04:53:27',0,0),(40,'hbjheD',14,8,'2026-01-28 13:12:54','2026-01-28 13:12:54',0,1),(41,'dfvbhgb',3,3,'2026-01-28 16:37:22','2026-01-28 16:37:22',0,0);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `msg` text NOT NULL,
  `true` timestamp NULL DEFAULT NULL,
  `is_action` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES (27,'20251231044651_create_contact_table.js',1,'2026-01-28 11:40:57'),(28,'20260128060356_create_table_post_view.js',1,'2026-01-28 11:40:59'),(29,'20260128111956_create_post_likes_table.js',1,'2026-01-28 11:40:59');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (10,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `user_id` int unsigned NOT NULL,
  `cat_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` int NOT NULL DEFAULT '0',
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `post_user_id_foreign` (`user_id`),
  KEY `post_cat_id_foreign` (`cat_id`),
  CONSTRAINT `post_cat_id_foreign` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'Trevel in the city of lack','Udaipur was discovered by Maharana Udai Singh in 1553. In the year 2009, Udaipur was named the best city in the world by a magazine. Udaipur is famous for its lakes, beautiful palaces, mountains, rooms and tiger gardens. There are also many royal palaces here that have been converted into luxurious hotels today.\r\nUdaipur, formerly the capital of the Mewar Kingdom, is a city in the western Indian state of Rajasthan. Founded by Maharana Udai Singh II in 1559, it’s set around a series of artificial lakes and is known for its lavish royal residences. City Palace, overlooking Lake Pichola, is a monumental complex of 11 palaces, courtyards and gardens, famed for its intricate peacock mosaics.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1767870506/udaypur_vh1r8g.webp',2,4,'2026-01-08 09:58:17','2026-01-08 09:58:17',0,'trevel-in-the-city-of-lack'),(2,'bussiness strategy','In the field of management, strategic management involves the formulation and implementation of the major goals and initiatives taken by an organization\'s managers on behalf of stakeholders\nThe 5 Ps—Plan, Ploy, Pattern, Position, and Perspective—offer a toolkit for leaders to think beyond the linear view of Strategy as a document. They invite you to analyze your Strategy from multiple angles, uncovering inconsistencies, missed signals, or hidden leverage','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768554638/k6xnc2whbsmtq7x6ov12.avif',2,3,'2026-01-08 11:43:36','2026-01-08 11:43:36',0,'bussiness-strategy'),(3,'Morden Eduction in the today\'s World','Modern education is the education given by schools and instituted today. Modern education includes current statistics and the latest study material. Since algorithms, strategies, and methods constantly change, modern education keeps up with the changes.\n\nEducation builds a strong base for students. It helps them learn essential life skills, career paths, and personal values. In a digital world, having good education helps students keep up with fast changes in industries and technology. Thanks to digital tools, learning is no longer tied to the classroom.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768210445/oirqxk5twq4aksli4mti.jpg',3,2,'2026-01-09 07:22:20','2026-01-09 07:22:20',0,'morden-eduction-in-the-today-s-world'),(5,'My Journey From Student to Software Engineer','I started coding during college without any clear direction.  \nI failed interviews, felt stuck many times, but never quit.  \nAfter one year of consistent learning and projects, I finally landed my first job.  \nThis journey taught me patience, discipline, and self-belief.\n\n','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768220989/gk98egndr9fqiq68oqsa.jpg',12,5,'2026-01-09 11:30:32','2026-01-09 11:30:32',0,'my-journey-from-student-to-software-engineer'),(6,'know me from the blog','I started waking up early, sitting quietly, and planning my day.  \nNo phone. No noise. Just clarity.  \nThis simple routine brought focus, discipline, and a sense of control I never had before.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1767959017/yuuwbu8kwsj8a2yxmy1b.webp',13,10,'2026-01-09 11:43:37','2026-01-09 11:43:37',0,'know-me-from-the-blog'),(7,'A day spend well at the seasore123','I woke up early and decided to escape the city for a day.  \nBy the time I reached the seashore, the sun was already rising, painting the sky with shades of orange and pink.\n\nThe sound of waves instantly slowed my mind.  \nI walked barefoot on the sand, letting the water touch my feet.  \nFishermen were returning with their nets, children were building sandcastles, and the breeze smelled like salt and freedom.\n\nI sat there for hours doing nothing — and for the first time in weeks, that felt perfect.  \nNo deadlines, no phone calls, no pressure.  \nJust me, the sea, and the sky.\n\nWhen the sun began to set, the entire beach glowed gold.  \nI left with tired feet, sun-kissed skin, and a heart that finally felt calm again.\n\nSome days are not meant to be productive.  \nSome days are meant to be remembered','https://res.cloudinary.com/dn2c84jdt/image/upload/v1767959161/cqfkkvhwsohqge55qa1m.jpg',13,9,'2026-01-09 11:46:02','2026-01-09 11:46:02',0,'a-day-spend-well-at-the-seasore123'),(8,'Investment Strategies for Entrepreneurs','As an entrepreneur, making smart investment decisions is crucial to ensuring the growth and sustainability of your business. Investing wisely can help you maximize your returns, mitigate risks, and create a strong financial foundation. Here are some essential investment strategies tailored for entrepreneurs:\n5 Popular Investment Strategies for Beginners\nAsset Allocation. Asset allocation refers to proportioning out different types of investments across your portfolio. ...\nDiversification. ...\nRebalancing. ...\nBuy-and-hold Strategy for Investing. ...\nDollar-Cost Averaging.\n','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768284956/kddhx4cp5xnte6nbj5rn.webp',14,3,'2026-01-13 06:15:57','2026-01-13 06:15:57',0,'investment-strategies-for-entrepreneurs'),(9,'Technologogy in today','Technology has become a vital part of our daily lives, influencing how we work, communicate, learn, and live. This blog explores the various ways technology improves efficiency, enhances comfort, and connects the world. From smartphones to smart homes, discover why tech is essential in today\'s fast-paced lifestyle','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768540313/k0d5ystxpur1visur8lm.webp',2,1,'2026-01-16 05:11:53','2026-01-16 05:11:53',0,'technologogy-in-today'),(10,'How AI is Changing Everyday Life','Artificial Intelligence is now part of healthcare, finance, education, and homes...\nAI has altered how people engage with technology and one another. Siri, Alexa, and Google Assistant are examples of voice assistants that can comprehend orders, respond to enquiries, and operate smart devices. Quick assistance for banking, shopping, and customer support is offered by chatbots and messaging apps.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768828990/dniazvsd2ghufsnezg8r.jpg',3,1,'2026-01-19 12:15:37','2026-01-19 12:15:37',0,'how-ai-is-changing-everyday-life'),(11,'\"Morning Habits That Improve Productivity','Fight the feeling of inertia by fueling your body with a healthy breakfast.\nStudies show that alertness spikes right after you have your morning oats, and eating a high-fiber, carb-rich meal will battle the sleepiness of inertia in the best way. \nt\'s not the end of the world, but I want to have some productive routines I can follow to give me a reason to be up every morning. I am a Personal Trainer so I generally exercise before or after my first clients of the day, and I always eat breakfast before work as well from my meal prep, and stay well hydrated. I\'ve had a look at some morning routines but they are generally things like dribk water, exercise, make breakfast, move alarm clock away from bed, or make bed (all of which I already do or cannot do - like make bed because my wife will still be asleep when I get up','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768900566/syftfnc4jjte1ojacwtu.png',15,12,'2026-01-20 09:16:06','2026-01-20 09:16:06',0,'morning-habits-that-improve-productivity'),(12,'How Sports Improve Mental Health','Sports help you manage stress. Exercise causes your body to release endorphins, the chemicals in your brain that relieve pain and stress. It also reduces the levels of stress hormones, cortisol and adrenaline. Studies have shown that 20 to 30 minutes of exercise each day can make people feel calmer.\nBeing physically active. Exercise reduces feelings of stress and depression and improves your mood.\nGetting enough sleep. Sleep affects your mood. ...\nHealthy eating. Good nutrition may help you feel better physically, improve your mood and decrease anxiety and stress.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768901744/w60p1eulxmool8rfzyzo.webp',15,8,'2026-01-20 09:35:44','2026-01-20 09:35:44',0,'how-sports-improve-mental-health'),(13,'Personal Branding for Entrepreneurs','Building a personal brand through self-promotion is especially valuable in the early stages of company development. Business-to-business companies that are seeking niche customers can find a solid personal brand particularly helpful.\nA personal brand, according to Amazon founder Jeff Bezos, is “what people say about you when you’re not in the room.” Controlling a personal brand is tricky. Telling stories and sharing the important moments of building a company are good ways to create content to build a relationship. While entrepreneurs or founders of startups cannot fully control their personal brands, there are ways to manage an online presence so a brand has a higher chance of success.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768903331/qddwelfdn69dbq5jcrqv.jpg',12,3,'2026-01-20 09:53:53','2026-01-20 09:53:53',0,'personal-branding-for-entrepreneurs'),(14,'Online Learning vs Traditional Education','Education is defined as the process of gaining knowledge, skills, and values with the help of various methods, experience, and teaching-learning practices. In today\'s world of modernization, education plays a very important role in making an individual\'s personal and professional growth and with the advancements in technology, the options for pursuing education have expanded significantly.\ntraditional and online education both have their unique advantages and disadvantages. The choice between the two depends on individual preferences, learning styles, and circumstances. Traditional education offers face-to-face interaction, structure, and networking opportunities but may lack flexibility and incur higher costs. On the other hand, online education provides flexibility, accessibility, and cost-effectiveness but requires self-discipline and may lack immediate personal interaction. Ultimately, it is important to consider these factors when making an informed decision about the most suitable approach to education.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768905312/al1qmyouvfimzsai1oot.png',2,2,'2026-01-20 10:35:12','2026-01-20 10:35:12',0,'online-learning-vs-traditional-education'),(15,'Unfogattable Moment :sunrise in Flower velly','Each sunrise is an opportunity to let go of yesterday and embrace today.” “When the sun rises, it reminds me that every day is a chance to rewrite my story.” “Sunrise is proof that the best things come in the quiet moments.” “The sun rises, but it\'s the moments that follow that truly shine.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768991486/vocl8nxc0icwbfzn9u4k.jpg',10,9,'2026-01-21 10:31:26','2026-01-21 10:31:26',0,'unfogattable-moment-sunrise-in-flower-velly'),(16,'Kutch (Bhuj) Earthquake –2001','On 26 January 2001, a devastating 7.7 magnitude earthquake struck the Kutch region of Gujarat, with its epicenter near Bhuj. It claimed nearly 20,000 lives, injured over 1.6 lakh people, and left around 6 lakh homeless. The disaster caused massive destruction to infrastructure and became one of the deadliest earthquakes in India’s history. The tragedy led to major reforms in disaster management and earthquake-resistant construction practices across the country.\nDeaths: ~20,000 people\nInjured: Over 167,000\nHomeless: Around 600,000\nVillages destroyed: 400+\nBuildings collapsed/damaged: Over 1 million\nEconomic loss: Approx. ₹30,000 crore\nMajorly affected cities:\nBhuj\nAnjar\nBhachau\nGandhidham\nRapar','https://res.cloudinary.com/dn2c84jdt/image/upload/v1768992061/dyki8om8m5jpf7djzj84.jpg',10,13,'2026-01-21 10:41:02','2026-01-21 10:41:02',0,'kutch-bhuj-earthquake-2001'),(17,'How Habitat Fragmentation Threatens Wildlife ','Habitat fragmentation, caused by roads, agriculture, and urban development, breaks large, connected ecosystems into smaller, isolated patches, severely threatening wildlife. It restricts movement, reduces genetic diversity, increases edge effects, and heightens human-wildlife conflict, leading to reduced population sizes, inbreeding, and increased risks of extinction','https://res.cloudinary.com/dn2c84jdt/image/upload/v1769146025/ah9sc14wf1kctsvb6tiu.jpg',1,9,'2026-01-23 05:27:05','2026-01-23 05:27:05',0,'how-habitat-fragmentation-threatens-wildlife'),(18,'The King\'s Only Kingdom: Gir National Park','Thinking\nSearching\nThe\nAsiatic Lion (Panthera leo persica) is the pride of India and the designated state animal of Gujarat\n. While the Tiger is India\'s national animal, the lion holds a singular place in the country\'s heritage as the only place in the world outside of Africa where these majestic big cats can be found in the wild.\nThe entire wild population of Asiatic lions is concentrated in the Gir Forest National Park\nand surrounding areas in Gujarat.\n\n    Population Growth: A major conservation success story, the population has grown from just a few dozen in the early 20th century to 891 lions as of the latest 2025 data.\n    Distinct Features: Asiatic lions are slightly smaller than African lions and possess a distinctive fold of skin running along their bellies. Males also tend to have shorter manes, which leave their ears visible.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1769146616/ooxqqfhfsjv7aftily0t.webp',16,9,'2026-01-23 05:36:57','2026-01-23 05:36:57',0,'the-king-s-only-kingdom-gir-national-park'),(19,'A big Wealth is our Health','Health is the most important thing in our life. Health is true wealth, and is more important than money! Staying healthy means having a fit body and mind. We should take care of our health every day.\nHealth is Wealth” means that health is the biggest wealth anybody can have. Anything can be achieved if we have good health. It is not enough to have money alone we can make good use of wealth only if we have good health.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1769597034/bmcnmjniierzjj51v55j.webp',14,7,'2026-01-28 10:43:55','2026-01-28 10:43:55',0,'a-big-wealth-is-our-health'),(20,'Golden Milk: Healing Tonic for Vitality and Flexibility','Golden Milk is an easy and delicious way to drink it. The warm tonic is especially beneficial for stiff joints, as curcumin, the active ingredient in turmeric lubricates the musculoskeletal system. The oil lubricates and energizes the joints, while the turmeric supports the bones and makes the joints more flexible. \nTurmeric is a healing food for the body. It comes from the root of a plant that is native to India but has been used across the globe for thousands of years.1\nTurmeric benefits the inner organs, the spine, and the joints. It purifies the blood and promotes general good health. \nGolden Milk can also help repair damage to nerve centers caused by drug and alcohol abuse. In this case, make this your daily habit for 40 consecutive days.','https://res.cloudinary.com/dn2c84jdt/image/upload/v1769682004/f6ojy64fcrfrp5hmmgcs.jpg',3,6,'2026-01-29 10:20:04','2026-01-29 10:20:04',0,'golden-milk-healing-tonic-for-vitality-and-flexibility');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id` (`post_id`,`user_id`) USING BTREE,
  KEY `post_likes_user_id_foreign` (`user_id`),
  CONSTRAINT `post_likes_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
INSERT INTO `post_likes` VALUES (20,17,2,'2026-01-29 13:06:22','2026-01-29 13:06:22'),(22,20,2,'2026-01-29 13:06:32','2026-01-29 13:06:32'),(33,3,3,'2026-01-30 05:08:09','2026-01-30 05:08:09'),(47,15,3,'2026-01-30 05:46:17','2026-01-30 05:46:17'),(49,12,3,'2026-01-30 05:57:22','2026-01-30 05:57:22'),(50,19,3,'2026-01-30 05:57:37','2026-01-30 05:57:37'),(52,15,2,'2026-01-30 05:59:38','2026-01-30 05:59:38'),(56,18,2,'2026-01-30 06:03:33','2026-01-30 06:03:33'),(57,20,3,'2026-01-30 06:03:45','2026-01-30 06:03:45'),(61,2,2,'2026-01-30 06:31:41','2026-01-30 06:31:41'),(62,14,2,'2026-01-30 06:48:08','2026-01-30 06:48:08');
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_view`
--

DROP TABLE IF EXISTS `post_view`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_view` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int unsigned NOT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_view_post_id_user_id_unique` (`post_id`,`user_id`),
  UNIQUE KEY `post_view_post_id_ip_address_unique` (`post_id`,`ip_address`),
  KEY `post_view_user_id_foreign` (`user_id`),
  CONSTRAINT `post_view_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_view_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_view`
--

LOCK TABLES `post_view` WRITE;
/*!40000 ALTER TABLE `post_view` DISABLE KEYS */;
INSERT INTO `post_view` VALUES (1,8,14,'::1','2026-01-28 11:50:39'),(2,18,14,'::1','2026-01-28 13:18:16'),(3,14,14,'::1','2026-01-28 13:18:25'),(4,16,NULL,'::1','2026-01-29 06:59:03'),(5,11,NULL,'::1','2026-01-29 09:48:16'),(6,20,3,'::1','2026-01-29 10:20:16'),(7,19,3,'::1','2026-01-29 13:41:51'),(8,15,NULL,'::1','2026-01-30 04:54:21'),(9,12,NULL,'::1','2026-01-30 04:54:35'),(10,13,3,'::1','2026-01-30 05:23:37');
/*!40000 ALTER TABLE `post_view` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'user','2026-01-06 12:15:05','2026-01-06 12:15:05',0),(2,'admin','2026-01-06 12:15:28','2026-01-06 12:15:28',0),(3,'Author','2026-01-13 13:20:08','2026-01-13 13:20:08',1),(4,'createor','2026-01-13 13:20:35','2026-01-13 13:20:35',1),(5,'writer','2026-01-26 07:42:17','2026-01-26 07:42:17',1);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int unsigned NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_delete` int NOT NULL DEFAULT '0',
  `is_blocked` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'william','william@gmail.com','$2b$10$OMH6yxdLP7Y5MJav5zv9bOkZg3zxrFGifk4aqR7nr2c2B91UpbWiO',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MSwibmFtZSI6IndpbGxpYW0iLCJlbWFpbCI6IndpbGxpYW1AZ21haWwuY29tIiwiY3JlYXRlZF9hdCI6IjIwMjYtMDEtMDZUMTI6MTY6MjAuMDAwWiIsImlhdCI6MTc2OTU5MTk5MSwiZXhwIjoxNzY5Njc4MzkxfQ.nH_qke6lN9P7nCbH6n9TLA58SgQY_DXxIFsfXYsq42Q','2026-01-06 12:16:20','2026-01-06 12:16:20',0,0),(2,'admin','admin@gmail.com','$2b$10$c8ytwY095WAAvngiR2SVlujcKgJXA910n3A50pX1qhRR8afX4fZbe',2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZV9pZCI6MiwibmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY5NzUyNzQyLCJleHAiOjE3Njk4MzkxNDJ9.7pWHXjqGrI3-QJ4IhGCZMw4aeg9sRiR1mQojsYE76Xg','2026-01-07 07:52:32','2026-01-07 07:52:32',0,0),(3,'amisha','amisha@gmail.com','$2b$10$R8KaStg52XmdzlHS1AFNEusEnWpBBYl9cy4Q2XEk187kRYDP46Hee',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6MSwibmFtZSI6ImFtaXNoYSIsImVtYWlsIjoiYW1pc2hhQGdtYWlsLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDI2LTAxLTA4VDEzOjI3OjUyLjAwMFoiLCJpYXQiOjE3Njk3NDg5MTUsImV4cCI6MTc2OTgzNTMxNX0.y1ILkXdpnB9vDHy8aIqKO1krSjdaTdXLrmh3RN-zvc4','2026-01-08 13:27:52','2026-01-08 13:27:52',0,0),(9,'Priya Singh','priya@gmail.com','$2b$10$jdsqhl0XKhNa6CGZ0oCiZeeD1gnyjW6zVucY6fqmUrYqwCH3MfXyu',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwicm9sZSI6MSwibmFtZSI6IlByaXlhIFNpbmdoIiwiZW1haWwiOiJwcml5YUBnbWFpbC5jb20iLCJjcmVhdGVkX2F0IjoiMjAyNi0wMS0wOVQxMTowMDozMi4wMDBaIiwiaWF0IjoxNzY5NTkxOTU4LCJleHAiOjE3Njk2NzgzNTh9.vArmAGXZb5rZ8evYfFdEFWAco-rep5L81bPNAuHhBTU','2026-01-09 11:00:32','2026-01-09 11:00:32',0,0),(10,'Arjun Kapoor','arjun@gmail.com','$2b$10$8vdoy3D27qXVILbgNZv99eUpHxQEhtRstYm/efNWj2ZpURQdf4Egy',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiJBcmp1biBLYXBvb3IiLCJyb2xlIjoxLCJ0eXBlIjoiaW1wZXJzb25hdGlvbiIsImFkbWluSWQiOjIsImlhdCI6MTc2OTY3MTczNiwiZXhwIjoxNzY5Njc1MzM2fQ.pQzEQY4oWl0NRZjBKtLBDBD9OI8EJCnphLWbt6Gbof8','2026-01-09 11:00:32','2026-01-09 11:00:32',0,0),(12,'marry','marry@gmail.com','$2b$10$k3EdCxMe3iBNTg985R/GpuUeCZXiDIGsq5Gkb.64pDcPaEm9Bvi9O',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsIm5hbWUiOiJtYXJyeSIsInJvbGUiOjEsInR5cGUiOiJpbXBlcnNvbmF0aW9uIiwiYWRtaW5JZCI6MiwiaWF0IjoxNzY5NjcyOTUxLCJleHAiOjE3Njk2NzY1NTF9.qQVJEiXBbDbQTlhDMaZizOS87IZ_piIqxACqEyme2fA','2026-01-09 11:24:14','2026-01-09 11:24:14',0,0),(13,'priya singh','priya11@gmail.com','$2b$10$WEGrPyF8QVtnpt2gVJewOu6gAjrYWRRgJ6NGY2oIHjgULzNU1yw0G',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsIm5hbWUiOiJwcml5YSBzaW5naCIsInJvbGUiOjEsInR5cGUiOiJpbXBlcnNvbmF0aW9uIiwiYWRtaW5JZCI6MiwiaWF0IjoxNzY5NTE5MzA0LCJleHAiOjE3Njk1MjI5MDR9.MhRXWvfcFJhxp3KWA1iiAYsNaT0r7Q6IQuxnqB9l4bA','2026-01-09 11:35:22','2026-01-09 11:35:22',0,0),(14,'viha patel','viha@gmail.com','$2b$10$ngjsuwjseAIUE33Q9aON2./MeuuhNg8yZ4vAlgw3FZx7ZQpZ8svSa',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInJvbGUiOjEsIm5hbWUiOiJ2aWhhIHBhdGVsIiwiZW1haWwiOiJ2aWhhQGdtYWlsLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDI2LTAxLTEzVDA2OjExOjIzLjAwMFoiLCJpYXQiOjE3Njk1OTY3NzMsImV4cCI6MTc2OTY4MzE3M30.nyVrTt4oat3L7lC5z_9s7Jb_b6OowKPHD7JwimZC1w0','2026-01-13 06:11:23','2026-01-13 06:11:23',0,0),(15,'ravi','ravi@gmail.com','$2b$10$7PEbotQAXhYT0lw05.bJKujmg/IE2iYMybdYt0Ept4yXMlnjEM8tW',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInJvbGUiOjEsIm5hbWUiOiJyYXZpIiwiZW1haWwiOiJyYXZpQGdtYWlsLmNvbSIsImNyZWF0ZWRfYXQiOiIyMDI2LTAxLTE1VDA2OjA2OjUyLjAwMFoiLCJpYXQiOjE3Njk1OTU3MTcsImV4cCI6MTc2OTY4MjExN30.rioaJ7aEwKlCrNEXYiDYPqemveCOWzyrwIfgY5s6p8I','2026-01-15 06:06:52','2026-01-15 06:06:52',0,0),(16,'janvi','janvi@gmail.com','$2b$10$h0ZtKBKcpcWguPo1X602VOtwClsveNkHmeFDXOeZYllvq4V7w.FIS',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsIm5hbWUiOiJqYW52aSIsInJvbGUiOjEsInR5cGUiOiJpbXBlcnNvbmF0aW9uIiwiYWRtaW5JZCI6MiwiaWF0IjoxNzY5NTc3MTc5LCJleHAiOjE3Njk1ODA3Nzl9.XxPQuhIZ2BoireJ2pz2mbtF1WikBobT8pVvutTZrR3U','2026-01-20 06:02:26','2026-01-20 06:02:26',0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-30 15:35:02
