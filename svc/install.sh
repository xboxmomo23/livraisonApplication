#!/bin/bash
# ============================================================
# HealDrive — Installation Services + Controllers + DTOs
# Executez depuis la racine du dossier backend/
# Usage: bash install.sh
# ============================================================

set -e

JAVA_BASE="src/main/java/com/healdrive"

echo "=== Creation des dossiers ==="
mkdir -p "$JAVA_BASE/dto"
mkdir -p "$JAVA_BASE/service"
mkdir -p "$JAVA_BASE/controller"

echo "=== Copie des fichiers ==="

# Detecter le dossier source (meme dossier que le script)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# DTOs
cp "$SCRIPT_DIR/dto/LoginRequest.java"       "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/LoginResponse.java"      "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/TrajetResponse.java"     "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/StatutUpdateRequest.java" "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/MessageResponse.java"    "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/MessageRequest.java"     "$JAVA_BASE/dto/"
cp "$SCRIPT_DIR/dto/DashboardStats.java"     "$JAVA_BASE/dto/"

# Services
cp "$SCRIPT_DIR/service/AuthService.java"    "$JAVA_BASE/service/"
cp "$SCRIPT_DIR/service/TrajetService.java"  "$JAVA_BASE/service/"
cp "$SCRIPT_DIR/service/MessageService.java" "$JAVA_BASE/service/"

# Controllers
cp "$SCRIPT_DIR/controller/AuthController.java"    "$JAVA_BASE/controller/"
cp "$SCRIPT_DIR/controller/TrajetController.java"   "$JAVA_BASE/controller/"
cp "$SCRIPT_DIR/controller/MessageController.java"  "$JAVA_BASE/controller/"

echo ""
echo "=== Installation terminee ==="
echo "Fichiers installes :"
find "$JAVA_BASE/dto" "$JAVA_BASE/service" "$JAVA_BASE/controller" -name "*.java" | sort
echo ""
echo "Lancez maintenant : mvn spring-boot:run"
