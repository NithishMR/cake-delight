#!/bin/bash

set -e

echo "=========================================="
echo "       Cake Delight Kubernetes Cleanup"
echo "=========================================="

echo ""
echo "Deleting Cake Delight Kubernetes resources..."

if kubectl get namespace cake-delight >/dev/null 2>&1; then
    kubectl delete namespace cake-delight
else
    echo "Namespace cake-delight does not exist."
fi

echo ""
echo "Removing Cake Delight Docker images..."

docker rmi \
  cake-delight-catalog-service:latest \
  cake-delight-order-service:latest \
  cake-delight-rating-service:latest \
  cake-delight-notification-service:latest \
  cake-delight-api-gateway:latest \
  cake-delight-frontend:latest \
  2>/dev/null || true

echo ""
echo "=========================================="
echo "Cake Delight cleanup completed!"
echo "=========================================="

echo ""
echo "Minikube itself was NOT deleted."
echo "You can run ./deploy.sh again for a fresh deployment."