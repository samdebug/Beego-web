-- MySQL dump 10.13  Distrib 5.5.38, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: facial_db
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cameras`
--

DROP TABLE IF EXISTS `cameras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cameras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cameras`
--

LOCK TABLES `cameras` WRITE;
/*!40000 ALTER TABLE `cameras` DISABLE KEYS */;
INSERT INTO `cameras` VALUES (4,'2017-07-12 08:48:06','2017-07-12 08:48:06','摄像头1','直连','192.168.2.120:8080/video','摄像头');
/*!40000 ALTER TABLE `cameras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `librarys`
--

DROP TABLE IF EXISTS `librarys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `librarys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `message` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `librarys`
--

LOCK TABLES `librarys` WRITE;
/*!40000 ALTER TABLE `librarys` DISABLE KEYS */;
INSERT INTO `librarys` VALUES (7,'目标库31232221','2017-07-10 16:50:08','2017-07-12 11:20:49','','普通'),(12,'123','2017-07-11 13:55:48','2017-07-11 13:55:48','','普通'),(14,'目标库323','2017-07-11 14:30:38','2017-07-11 15:50:38','vxcv','普通'),(15,'目标库3','2017-07-11 14:31:37','2017-07-11 15:46:31','','普通'),(16,'目标库4','2017-07-11 14:31:48','2017-07-11 14:31:48','','黑名单');
/*!40000 ALTER TABLE `librarys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_attachment`
--

DROP TABLE IF EXISTS `md_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_attachment` (
  `attachment_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL DEFAULT '0',
  `document_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL DEFAULT '',
  `file_path` varchar(2000) NOT NULL DEFAULT '',
  `file_size` double NOT NULL DEFAULT '0',
  `http_path` varchar(2000) NOT NULL DEFAULT '',
  `file_ext` varchar(50) NOT NULL DEFAULT '',
  `create_time` datetime NOT NULL,
  `create_at` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attachment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_attachment`
--

LOCK TABLES `md_attachment` WRITE;
/*!40000 ALTER TABLE `md_attachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `md_attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_books`
--

DROP TABLE IF EXISTS `md_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_books` (
  `book_id` int(11) NOT NULL AUTO_INCREMENT,
  `book_name` varchar(500) NOT NULL DEFAULT '',
  `identify` varchar(100) NOT NULL DEFAULT '',
  `order_index` int(11) NOT NULL DEFAULT '0',
  `description` varchar(2000) NOT NULL DEFAULT '',
  `label` varchar(500) NOT NULL DEFAULT '',
  `privately_owned` int(11) NOT NULL DEFAULT '0',
  `private_token` varchar(500) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `editor` varchar(50) NOT NULL DEFAULT '',
  `doc_count` int(11) NOT NULL DEFAULT '0',
  `comment_status` varchar(20) NOT NULL DEFAULT 'open',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `cover` varchar(1000) NOT NULL DEFAULT '',
  `theme` varchar(255) NOT NULL DEFAULT 'default',
  `create_time` datetime NOT NULL,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `modify_time` datetime DEFAULT NULL,
  `version` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `identify` (`identify`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_books`
--

LOCK TABLES `md_books` WRITE;
/*!40000 ALTER TABLE `md_books` DISABLE KEYS */;
INSERT INTO `md_books` VALUES (1,'MinDoc演示项目','mindoc',0,'这是一个MinDoc演示项目，该项目是由系统初始化时自动创建。','',0,'',0,'markdown',1,'closed',0,'/static/images/book.jpg','default','2017-07-08 11:59:34',1,'2017-07-08 11:59:34',1499486374);
/*!40000 ALTER TABLE `md_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_document_history`
--

DROP TABLE IF EXISTS `md_document_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_document_history` (
  `history_id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL DEFAULT '',
  `action_name` varchar(255) NOT NULL DEFAULT '',
  `document_id` int(11) NOT NULL DEFAULT '0',
  `document_name` varchar(500) NOT NULL DEFAULT '',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `markdown` longtext,
  `content` longtext,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `modify_time` datetime NOT NULL,
  `modify_at` int(11) NOT NULL DEFAULT '0',
  `version` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`history_id`),
  KEY `md_document_history_document_id` (`document_id`),
  KEY `md_document_history_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_document_history`
--

LOCK TABLES `md_document_history` WRITE;
/*!40000 ALTER TABLE `md_document_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `md_document_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_documents`
--

DROP TABLE IF EXISTS `md_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_documents` (
  `document_id` int(11) NOT NULL AUTO_INCREMENT,
  `document_name` varchar(500) NOT NULL DEFAULT '',
  `identify` varchar(100) DEFAULT 'null',
  `book_id` int(11) NOT NULL DEFAULT '0',
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `order_sort` int(11) NOT NULL DEFAULT '0',
  `markdown` longtext,
  `release` longtext,
  `content` longtext,
  `create_time` datetime NOT NULL,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `modify_time` datetime NOT NULL,
  `modify_at` int(11) NOT NULL DEFAULT '0',
  `version` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`document_id`),
  KEY `md_documents_identify` (`identify`),
  KEY `md_documents_book_id` (`book_id`),
  KEY `md_documents_parent_id` (`parent_id`),
  KEY `md_documents_order_sort` (`order_sort`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_documents`
--

LOCK TABLES `md_documents` WRITE;
/*!40000 ALTER TABLE `md_documents` DISABLE KEYS */;
INSERT INTO `md_documents` VALUES (1,'空白文档','',1,0,0,'','','','2017-07-08 11:59:34',1,'2017-07-08 11:59:34',0,1499486374);
/*!40000 ALTER TABLE `md_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_logs`
--

DROP TABLE IF EXISTS `md_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_logs` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `category` varchar(255) NOT NULL DEFAULT 'operate',
  `content` longtext NOT NULL,
  `original_data` longtext NOT NULL,
  `present_data` longtext NOT NULL,
  `create_time` datetime NOT NULL,
  `user_agent` varchar(500) NOT NULL DEFAULT '',
  `ip_address` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_logs`
--

LOCK TABLES `md_logs` WRITE;
/*!40000 ALTER TABLE `md_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `md_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_member_token`
--

DROP TABLE IF EXISTS `md_member_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_member_token` (
  `token_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `token` varchar(150) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL DEFAULT '',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0',
  `valid_time` datetime DEFAULT NULL,
  `send_time` datetime NOT NULL,
  PRIMARY KEY (`token_id`),
  KEY `md_member_token_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_member_token`
--

LOCK TABLES `md_member_token` WRITE;
/*!40000 ALTER TABLE `md_member_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `md_member_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_members`
--

DROP TABLE IF EXISTS `md_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_members` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(1000) NOT NULL DEFAULT '',
  `auth_method` varchar(50) NOT NULL DEFAULT 'local',
  `description` varchar(2000) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `phone` varchar(255) DEFAULT 'null',
  `avatar` varchar(1000) NOT NULL DEFAULT '',
  `role` int(11) NOT NULL DEFAULT '1',
  `status` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime NOT NULL,
  `create_at` int(11) NOT NULL DEFAULT '0',
  `last_login_time` datetime DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `account` (`account`),
  UNIQUE KEY `email` (`email`),
  KEY `md_members_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_members`
--

LOCK TABLES `md_members` WRITE;
/*!40000 ALTER TABLE `md_members` DISABLE KEYS */;
INSERT INTO `md_members` VALUES (1,'admin','YFGHlJ4cxdGLhtRzpPBU-JYt9icK-QVbC7W0pF6Q01mhI9TQOpeRD6AsTUbVd7LPyhKK$15$56e4ea5f93045d58ea5f8f7e2d47a99e760d95eb6c32594b3a8d9fa1$5bc5b680a34de44554de212e77d17b7d1f1092b4f278c59690e0828cecb0231f','local','','admin@iminho.me','','/uploads/201707/avatar_14d07f74368d3480_small.jpg',0,0,'2017-07-08 11:59:34',0,'2017-07-12 11:20:06');
/*!40000 ALTER TABLE `md_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_migrations`
--

DROP TABLE IF EXISTS `md_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_migrations` (
  `migration_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL DEFAULT '',
  `statements` longtext,
  `status` varchar(255) NOT NULL DEFAULT 'update',
  `create_time` datetime NOT NULL,
  `version` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`migration_id`),
  UNIQUE KEY `version` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_migrations`
--

LOCK TABLES `md_migrations` WRITE;
/*!40000 ALTER TABLE `md_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `md_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_options`
--

DROP TABLE IF EXISTS `md_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_options` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `option_title` varchar(500) NOT NULL DEFAULT '',
  `option_name` varchar(80) NOT NULL DEFAULT '',
  `option_value` longtext,
  `remark` longtext,
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_options`
--

LOCK TABLES `md_options` WRITE;
/*!40000 ALTER TABLE `md_options` DISABLE KEYS */;
INSERT INTO `md_options` VALUES (1,'是否启用注册','ENABLED_REGISTER','false',''),(2,'是否启用文档历史','ENABLE_DOCUMENT_HISTORY','true',''),(3,'是否启用验证码','ENABLED_CAPTCHA','true',''),(4,'启用匿名访问','ENABLE_ANONYMOUS','false',''),(5,'站点名称','SITE_NAME','MinDoc','');
/*!40000 ALTER TABLE `md_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `md_relationship`
--

DROP TABLE IF EXISTS `md_relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `md_relationship` (
  `relationship_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL DEFAULT '0',
  `book_id` int(11) NOT NULL DEFAULT '0',
  `role_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`relationship_id`),
  UNIQUE KEY `member_id` (`member_id`,`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `md_relationship`
--

LOCK TABLES `md_relationship` WRITE;
/*!40000 ALTER TABLE `md_relationship` DISABLE KEYS */;
INSERT INTO `md_relationship` VALUES (1,1,1,0);
/*!40000 ALTER TABLE `md_relationship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `targets`
--

DROP TABLE IF EXISTS `targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `targets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `identity` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `age` int(11) NOT NULL,
  `nation` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `library` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_targets_librarys_library` (`library`),
  CONSTRAINT `fk_targets_librarys_library` FOREIGN KEY (`library`) REFERENCES `librarys` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `targets`
--

LOCK TABLES `targets` WRITE;
/*!40000 ALTER TABLE `targets` DISABLE KEYS */;
INSERT INTO `targets` VALUES (1,'雷杰','2017-07-07 17:38:11','2017-07-07 17:38:11','97879587','/home/targets/9787958723.jpg','male',5,23,'汉','江西','极度危险人物',7),(2,'巴顿','2017-07-07 17:50:33','2017-07-07 17:50:33','1238763284t8','/home/targets/1238763284t830.jpg','male',5,30,'汉','五知','极度恐怖人物',7);
/*!40000 ALTER TABLE `targets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-12 14:27:04
