-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: watercleaner
-- ------------------------------------------------------
-- Server version	5.6.10

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
-- Table structure for table `commodity`
--

DROP TABLE IF EXISTS `commodity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commodity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commodityName` varchar(100) NOT NULL,
  `commodityPrice` varchar(100) NOT NULL,
  `commodityStock` varchar(100) NOT NULL,
  `commodityImg` varchar(1000) NOT NULL,
  `commoditySold` varchar(100) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commodity`
--

LOCK TABLES `commodity` WRITE;
/*!40000 ALTER TABLE `commodity` DISABLE KEYS */;
INSERT INTO `commodity` VALUES (1,'过滤芯','39','596','img/2017/3/17/105239.jpg','0'),(2,'饮水机','79','156','img/2017/3/17/151723.jpg','0'),(3,'飞机杯','128','56','public\\images\\commodityImages-1458555024787.jpg','0'),(4,'坦克杯','799','65','public\\images\\commodityImages-1458555095174.jpg','0'),(5,'马克杯','39','57','public\\images\\commodityImages-1458557014317.jpg','0'),(6,'火箭杯','79999','1','public\\images\\commodityImages-1458557242564.jpg','0'),(7,'轮船杯','19','5','public\\images\\commodityImages-1458557320962.jpg','0'),(8,'星球杯','0.5','199','public\\images\\commodityImages-1458557395325.jpg','0'),(9,'神马杯','89','78','public\\images\\commodityImages-1458634854402.jpg','0');
/*!40000 ALTER TABLE `commodity` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-25 17:52:56
