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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adminEmail` varchar(100) NOT NULL,
  `adminPassword` varchar(100) NOT NULL,
  `Level` varchar(20) NOT NULL DEFAULT '2',
  `adminName` varchar(100) NOT NULL,
  `adminCreateDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `adminLoginDate` varchar(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'xiangxuan.qu@hekr.me','$2a$10$oZYXNbICvSeUeGuYAnSHce1tsVwzbBRPxYZxez6/bTBgigr42prWC','1','瞿祥轩','2016-03-24 05:50:34','2016-03-25 17:48:14.366'),(4,'yufei.dan@hekr.me','$2a$10$wMdHAGvCtrO/rk4CHrbMkeAqONfqQttHPzEJ/gw6V/GNj9m2sUprm','2','单宇飞','2016-03-24 07:19:52','2016-03-25 17:06:07.764'),(6,'jinbiao.hu@hekr.me','$2a$10$KBgyQIm6QWGUmhpdOmZNbubVmLhM2Mdp2jbHy00RyCqUtjmgWagGO','2','东邪','2016-03-24 08:27:14','-'),(7,'jiachen.yao@hekr.me','$2a$10$TzSbroAwAvLMpQppSfrwq.Bw4VyxYSnjUlWnvoyOyjS.Elren5bRq','2','姚嘉晨','2016-03-24 08:31:19','-');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
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
