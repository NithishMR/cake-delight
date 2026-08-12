#!/bin/bash

set -e

echo "=========================================="
echo "       Cake Delight Kubernetes Deploy"
echo "=========================================="

echo ""
echo "Checking Minikube..."

if ! minikube status >/dev/null 2>&1; then
    echo "Minikube is not running. Starting Minikube..."
    minikube start
else
    echo "Minikube is already running."
fi

echo ""
echo "=========================================="
echo "Building Docker images"
echo "=========================================="

docker build -t cake-delight-catalog-service:latest ./catalog-service
docker build -t cake-delight-order-service:latest ./order-service
docker build -t cake-delight-rating-service:latest ./rating-service
docker build -t cake-delight-notification-service:latest ./notification-service
docker build -t cake-delight-api-gateway:latest ./gateway-service
docker build -t cake-delight-frontend:latest ./frontend-service

echo ""
echo "=========================================="
echo "Loading images into Minikube"
echo "=========================================="

minikube image load cake-delight-catalog-service:latest
minikube image load cake-delight-order-service:latest
minikube image load cake-delight-rating-service:latest
minikube image load cake-delight-notification-service:latest
minikube image load cake-delight-api-gateway:latest
minikube image load cake-delight-frontend:latest

echo ""
echo "=========================================="
echo "Creating Kubernetes namespace"
echo "=========================================="

kubectl apply -f k8s/namespace.yaml

echo ""
echo "=========================================="
echo "Applying Kubernetes manifests"
echo "=========================================="

kubectl apply -f k8s/

echo ""
echo "=========================================="
echo "Waiting for deployments"
echo "=========================================="

kubectl rollout status deployment/mongo-catalog -n cake-delight
kubectl rollout status deployment/mongo-order -n cake-delight
kubectl rollout status deployment/mongo-rating -n cake-delight
kubectl rollout status deployment/mongo-notification -n cake-delight
kubectl rollout status deployment/rabbitmq-service -n cake-delight
kubectl rollout status deployment/catalog-service -n cake-delight
kubectl rollout status deployment/order-service -n cake-delight
kubectl rollout status deployment/rating-service -n cake-delight
kubectl rollout status deployment/notification-service -n cake-delight
kubectl rollout status deployment/api-gateway -n cake-delight
kubectl rollout status deployment/frontend -n cake-delight

echo ""
echo "=========================================="
echo "Cake Delight deployed successfully!"
echo "=========================================="

MINIKUBE_IP=$(minikube ip)

echo ""
echo "Frontend:"
echo "http://${MINIKUBE_IP}:30080"

echo ""
echo "API Gateway:"
echo "http://${MINIKUBE_IP}:30081"

echo ""
echo "=========================================="
echo "Deployment complete"
echo "=========================================="