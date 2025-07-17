/*
 Navicat Premium Data Transfer

 Source Server         : Server
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Host           : 10.7.33.8:3306
 Source Schema         : moms

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 17/07/2025 11:49:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for aabas
-- ----------------------------
DROP TABLE IF EXISTS `aabas`;
CREATE TABLE `aabas`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aaba_name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_date` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_current` int NOT NULL,
  `isactive` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 102 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for bargikaran
-- ----------------------------
DROP TABLE IF EXISTS `bargikaran`;
CREATE TABLE `bargikaran`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `napa_id` bigint NULL DEFAULT NULL,
  `napa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gabisa_id` bigint NULL DEFAULT NULL,
  `gabisa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ward_no` bigint NULL DEFAULT NULL,
  `sheet_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `kitta_no` int NULL DEFAULT NULL,
  `area` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `bargikaran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sno` bigint NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx1`(`office_id`, `napa_id`, `gabisa_id`, `ward_no`, `kitta_no`) USING BTREE,
  INDEX `idx2`(`office_id`) USING BTREE,
  INDEX `idx3`(`office_id`, `napa_id`, `gabisa_id`, `ward_no`, `sheet_no`, `kitta_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 850508 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for brg_ofc
-- ----------------------------
DROP TABLE IF EXISTS `brg_ofc`;
CREATE TABLE `brg_ofc`  (
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brg_ofc_np
-- ----------------------------
DROP TABLE IF EXISTS `brg_ofc_np`;
CREATE TABLE `brg_ofc_np`  (
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `napa_id` bigint NULL DEFAULT NULL,
  `napa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brg_ofc_np_gb
-- ----------------------------
DROP TABLE IF EXISTS `brg_ofc_np_gb`;
CREATE TABLE `brg_ofc_np_gb`  (
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `napa_id` bigint NULL DEFAULT NULL,
  `napa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gabisa_id` bigint NULL DEFAULT NULL,
  `gabisa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brg_ofc_np_gb_wd
-- ----------------------------
DROP TABLE IF EXISTS `brg_ofc_np_gb_wd`;
CREATE TABLE `brg_ofc_np_gb_wd`  (
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `napa_id` bigint NULL DEFAULT NULL,
  `napa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gabisa_id` bigint NULL DEFAULT NULL,
  `gabisa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ward_no` bigint NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for brg_ofc_np_gb_wd_st
-- ----------------------------
DROP TABLE IF EXISTS `brg_ofc_np_gb_wd_st`;
CREATE TABLE `brg_ofc_np_gb_wd_st`  (
  `office_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `napa_id` bigint NULL DEFAULT NULL,
  `napa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gabisa_id` bigint NULL DEFAULT NULL,
  `gabisa_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ward_no` bigint NULL DEFAULT NULL,
  `sheet_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for kitta
-- ----------------------------
DROP TABLE IF EXISTS `kitta`;
CREATE TABLE `kitta`  (
  `F1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F6` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F7` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F8` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F9` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F10` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F11` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F12` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F13` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F14` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F15` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F16` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F17` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F18` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F19` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F20` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F21` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F22` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F23` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `F24` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for misil
-- ----------------------------
DROP TABLE IF EXISTS `misil`;
CREATE TABLE `misil`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `poka_id` bigint NOT NULL,
  `miti` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `minum` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nibedakname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nibedakaddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `jaggadhaniname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `jaggadhaniaddress` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` int NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by_user_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `mpokafk`(`poka_id`) USING BTREE,
  INDEX `muserfk`(`created_by_user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28159 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for misil_pokas
-- ----------------------------
DROP TABLE IF EXISTS `misil_pokas`;
CREATE TABLE `misil_pokas`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `office_id` bigint NOT NULL,
  `aaba_id` bigint NOT NULL,
  `misil_type_id` bigint NOT NULL,
  `sno` int NULL DEFAULT NULL,
  `misil_poka_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fant` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `misilcount` int NULL DEFAULT 0,
  `remarks` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` int NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by_user_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pokaofficeidfk`(`office_id`) USING BTREE,
  INDEX `pokaaabaidfk`(`aaba_id`) USING BTREE,
  INDEX `pokamisiltypefk`(`misil_type_id`) USING BTREE,
  INDEX `pokauserfk`(`created_by_user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 684 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for misil_type
-- ----------------------------
DROP TABLE IF EXISTS `misil_type`;
CREATE TABLE `misil_type`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `misil_type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `prefix` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `isactive` int NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for modules
-- ----------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `module` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `display_order` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for offices
-- ----------------------------
DROP TABLE IF EXISTS `offices`;
CREATE TABLE `offices`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `state_id` bigint NULL DEFAULT NULL,
  `office_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isvoucherchecked` int NULL DEFAULT NULL,
  `isactive` int NULL DEFAULT NULL,
  `usenepcalendar` int NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100000 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for states
-- ----------------------------
DROP TABLE IF EXISTS `states`;
CREATE TABLE `states`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `state_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isactive` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user_modules
-- ----------------------------
DROP TABLE IF EXISTS `user_modules`;
CREATE TABLE `user_modules`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `office_id` bigint NULL DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `module_id` bigint NOT NULL,
  `isactive` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_um_moid_mtable`(`module_id`) USING BTREE,
  INDEX `fk_um_uid_utable`(`user_id`) USING BTREE,
  CONSTRAINT `fk_um_moid_mtable` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_um_uid_utable` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3329 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nepname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `engname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `contactno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `role` bigint NOT NULL,
  `office_id` bigint NOT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by_user_id` bigint NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `isactive` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE,
  INDEX `userfkofficeid`(`office_id`) USING BTREE,
  INDEX `userfkrole`(`role`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 140 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher
-- ----------------------------
DROP TABLE IF EXISTS `voucher`;
CREATE TABLE `voucher`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aaba_id` bigint NOT NULL,
  `office_id` bigint NOT NULL,
  `edate_voucher` date NULL DEFAULT NULL,
  `ndate_voucher` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `edate_transaction` date NOT NULL,
  `ndate_transaction` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `month_id` bigint NOT NULL,
  `sirshak_id` bigint NOT NULL,
  `fant_id` bigint NOT NULL,
  `napa_id` bigint NOT NULL,
  `voucherno` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `deposited_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_user_id` int NOT NULL,
  `created_by_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by_user_id` int NULL DEFAULT NULL,
  `updated_by_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `vfkaaba`(`aaba_id`) USING BTREE,
  INDEX `vfkofcid`(`office_id`) USING BTREE,
  INDEX `vfkmonid`(`month_id`) USING BTREE,
  INDEX `vfksrshkid`(`sirshak_id`) USING BTREE,
  INDEX `vfkfntid`(`fant_id`) USING BTREE,
  INDEX `vfknpid`(`napa_id`) USING BTREE,
  CONSTRAINT `vfkaaba` FOREIGN KEY (`aaba_id`) REFERENCES `aabas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `vfkfntid` FOREIGN KEY (`fant_id`) REFERENCES `voucher_fant` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `vfkmonid` FOREIGN KEY (`month_id`) REFERENCES `voucher_month` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `vfkofcid` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `vfksrshkid` FOREIGN KEY (`sirshak_id`) REFERENCES `voucher_sirshak` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30053 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_acc_sirshak
-- ----------------------------
DROP TABLE IF EXISTS `voucher_acc_sirshak`;
CREATE TABLE `voucher_acc_sirshak`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `acc_sirshak_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_badhfadh
-- ----------------------------
DROP TABLE IF EXISTS `voucher_badhfadh`;
CREATE TABLE `voucher_badhfadh`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `aaba_id` bigint NOT NULL,
  `state_id` bigint NOT NULL,
  `acc_sirshak_id` bigint NOT NULL,
  `sangh` decimal(5, 2) NOT NULL,
  `pardesh` decimal(5, 2) NOT NULL,
  `isthaniye` decimal(5, 2) NOT NULL,
  `sanchitkosh` decimal(5, 2) NOT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `voucher_badhfadh_aaba_id_091ce24f_fk_voucher_aaba_id`(`aaba_id`) USING BTREE,
  INDEX `voucher_badhfadh_pardes_id_402e2f17_fk_voucher_pardes_id`(`state_id`) USING BTREE,
  INDEX `voucher_badhfadh_sirshak_id_c2ecda73_fk_voucher_sirshak_id`(`acc_sirshak_id`) USING BTREE,
  CONSTRAINT `vbfkpardesh` FOREIGN KEY (`state_id`) REFERENCES `voucher_state` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `vbfksirshak` FOREIGN KEY (`acc_sirshak_id`) REFERENCES `voucher_acc_sirshak` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 255 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_deleted
-- ----------------------------
DROP TABLE IF EXISTS `voucher_deleted`;
CREATE TABLE `voucher_deleted`  (
  `id` bigint NOT NULL,
  `aaba_id` bigint NOT NULL,
  `office_id` bigint NOT NULL,
  `edate_transaction` date NOT NULL,
  `ndate_transaction` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `edate_voucher` date NULL DEFAULT NULL,
  `ndate_voucher` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `month_id` bigint NOT NULL,
  `sirshak_id` bigint NOT NULL,
  `fant_id` bigint NOT NULL,
  `napa_id` bigint NOT NULL,
  `voucherno` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `deposited_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `created_by_user_id` int NOT NULL,
  `created_by_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by_user_id` int NULL DEFAULT NULL,
  `updated_by_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `deleted_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_by_user_id` int NULL DEFAULT NULL,
  `deleted_by_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  INDEX `vfkaaba`(`aaba_id`) USING BTREE,
  INDEX `vfkofcid`(`office_id`) USING BTREE,
  INDEX `vfkmonid`(`month_id`) USING BTREE,
  INDEX `vfksrshkid`(`sirshak_id`) USING BTREE,
  INDEX `vfkfntid`(`fant_id`) USING BTREE,
  INDEX `vfknpid`(`napa_id`) USING BTREE,
  CONSTRAINT `voucher_deleted_ibfk_1` FOREIGN KEY (`aaba_id`) REFERENCES `aabas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `voucher_deleted_ibfk_2` FOREIGN KEY (`fant_id`) REFERENCES `voucher_fant` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `voucher_deleted_ibfk_3` FOREIGN KEY (`month_id`) REFERENCES `voucher_month` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `voucher_deleted_ibfk_4` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `voucher_deleted_ibfk_5` FOREIGN KEY (`sirshak_id`) REFERENCES `voucher_sirshak` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_fant
-- ----------------------------
DROP TABLE IF EXISTS `voucher_fant`;
CREATE TABLE `voucher_fant`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `office_id` bigint NOT NULL,
  `fant_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL,
  `isactive` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `voucher_fant_office_id_8abe4392_fk_voucher_office_id`(`office_id`) USING BTREE,
  CONSTRAINT `fantfkofc` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_month
-- ----------------------------
DROP TABLE IF EXISTS `voucher_month`;
CREATE TABLE `voucher_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `month_order` int NOT NULL,
  `month_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_napa
-- ----------------------------
DROP TABLE IF EXISTS `voucher_napa`;
CREATE TABLE `voucher_napa`  (
  `napa_id` bigint NOT NULL AUTO_INCREMENT,
  `id` bigint NOT NULL,
  `office_id` bigint NOT NULL,
  `napa_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`napa_id`) USING BTREE,
  INDEX `voucher_napa_office_id_39475ee0_fk_voucher_office_id`(`office_id`) USING BTREE,
  CONSTRAINT `napafkofc` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 251 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_parameter
-- ----------------------------
DROP TABLE IF EXISTS `voucher_parameter`;
CREATE TABLE `voucher_parameter`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `office_id` bigint NOT NULL,
  `vstart` int NOT NULL,
  `vlength` int NOT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `voucher_voucherparm_office_id_4d5ad558_fk_voucher_office_id`(`office_id`) USING BTREE,
  CONSTRAINT `vpmfkofcid` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 159 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_sirshak
-- ----------------------------
DROP TABLE IF EXISTS `voucher_sirshak`;
CREATE TABLE `voucher_sirshak`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sirshak_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `acc_sirshak_id` bigint NULL DEFAULT NULL,
  `display_order` int NULL DEFAULT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for voucher_state
-- ----------------------------
DROP TABLE IF EXISTS `voucher_state`;
CREATE TABLE `voucher_state`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `state_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
