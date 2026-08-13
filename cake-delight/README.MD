# Cake Delight

Cake Delight is a microservices-based cake ordering application. The application provides a complete flow for browsing cakes, managing a basket, placing orders, completing payment, receiving notifications, and submitting ratings.

The project can be run / deployed to a local Kubernetes cluster using Minikube.

An end to end demo video has been provided.
---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Kubernetes Setup - Recommended](#kubernetes-setup---recommended)
8. [Kubernetes Services](#kubernetes-services)
9. [Persistent Storage](#persistent-storage)
10. [Application Flow](#application-flow)
11. [API Documentation](#api-documentation)
12. [RabbitMQ Event Flow](#rabbitmq-event-flow)
13. [Database Models](#database-models)
14. [Testing the Application](#testing-the-application)
15. [Stopping and Restarting](#stopping-and-restarting)
16. [Cleanup](#cleanup)
17. [Configuration](#configuration)
18. [Error Handling and Resilience](#error-handling-and-resilience)
19. [Assumptions and Limitations](#assumptions-and-limitations)
20. [Future Improvements](#future-improvements)
21. [Quick Start](#QuickStart)
20. [Project Summary](#Project Summary)

---

## Overview

Cake Delight is divided into independent backend services. Each service owns its own data and responsibility.

The main components are:

- **Frontend** - User interface for browsing cakes, managing the basket, placing orders, viewing ratings, and viewing notifications.
- **API Gateway** - Single entry point for frontend API requests.
- **Catalog Service** - Manages cake catalogue data.
- **Order Service** - Manages baskets and orders.
- **Rating Service** - Manages customer ratings.
- **Notification Service** - Creates and manages order notifications.
- **MongoDB** - Separate database instance for each backend service.
- **RabbitMQ** - Handles asynchronous `order.completed` events.

---

## Features

### Catalog

- View all cakes
- Search cakes by name
- Filter cakes by category
- Filter cakes by minimum and maximum price
- View individual cake details
- Automatically seed the catalogue when the database is empty

### Basket

- Add cakes to the basket
- Increase or update cake quantity
- Remove cakes
- View basket total

### Orders

- Checkout the current basket
- Create an order with `PENDING` status
- Complete the payment/order
- Change order status to `COMPLETED`
- View order history
- View individual order details

### Ratings

- Automatically create pending rating requests when an order is completed
- Submit a 1-5 star rating
- View pending ratings
- View completed customer ratings (Shown in average)
- View Average ratings for all cakes

### Notifications

- Automatically create an in-app notification when an order is completed
- View customer notifications
- Mark notifications as read when user clicks it
- Delete notifications

---

# Architecture

```text
                         +----------------+
                         |    Frontend    |
                         +-------+--------+
                                 |
                                 v
                         +---------------+
                         |  API Gateway  |
                         +-------+-------+
                                 |
              +------------------+------------------+-----------------
              |                  |                  |                |
              v                  v                  v                v
       +-------------+    +-------------+    +-------------+  +-------------+
       |   Catalog   |    |    Order    |    |   Rating    |  | Notification|
       |   Service   |    |   Service   |    |   Service   |  |   Service   |
       +------+------+    +------+------+    +------+------+  +------+------+
              |                  |                  |                |
              v                  v                  v                v
       +-------------+    +-------------+    +-------------+   +------------------+
       |Mongo Catalog|    | Mongo Order |    | Mongo Rating|   |Mongo Notification|
       +-------------+    +-------------+    +-------------+   +------------------+
                                 |
                                 | order.completed
                                 v
                         +---------------+
                         |   RabbitMQ    |
                         | order.events  |
                         +-------+-------+
                                 |
                         +-------+-------+
                         |               |
                         v               v
                  +------------+  +----------------+
                  |   Rating   |  | Notification   |
                  |   Consumer |  |    Consumer    |
                  +------------+  +-------+--------+
                                         |
                                         v
                                  +-------------+
                                  |   Mongo     |
                                  | Notification|
                                  +-------------+
```

The API Gateway exposes a single API entry point to the frontend. Backend services communicate directly with other services when required, while asynchronous order completion events are distributed through RabbitMQ.

---

# Technology Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Frontend |
| Node.js | Backend runtime |
| Express.js | REST APIs |
| Mongoose | MongoDB ODM |
| MongoDB | Persistent data storage |
| RabbitMQ | Asynchronous messaging |
| Express Gateway | API Gateway |
| Docker | Containerization |
| Kubernetes | Container orchestration |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes management |

---

# Project Structure

```text
cake-delight/
│
├── frontend-service/
│
├── gateway-service/
│
├── catalog-service/
│
├── order-service/
│
├── rating-service/
│
├── notification-service/
│
├── k8s/
│   ├── namespace.yaml
│   ├── mongo-catalog.yaml
│   ├── mongo-order.yaml
│   ├── mongo-rating.yaml
│   ├── mongo-notification.yaml
│   ├── rabbitmq.yaml
│   ├── catalog-service.yaml
│   ├── order-service.yaml
│   ├── rating-service.yaml
│   ├── notification-service.yaml
│   ├── gateway-config.yaml
│   ├── gateway-service.yaml
│   └── frontend.yaml
│
├── deploy.sh
├── cleanup.sh
└── README.md
```

---

# Prerequisites

The following tools are required for the Kubernetes deployment:

- Docker
- Minikube
- kubectl

Verify the tools:

```bash
docker --version
minikube version
kubectl version --client
```

---

# Kubernetes Setup - Recommended

The repository contains a `deploy.sh` script that automates the Kubernetes deployment.

## 1. Extract the Zip file and move to the root directory




> **Important:** `./deploy.sh` must be executed from the **root directory of the project**, where `deploy.sh` is located.

Your terminal should be inside:

```text
cake-delight/
```

before running the deployment script.

---

## 2. Start Minikube

Start the local Kubernetes cluster:

```bash
minikube start
```

Verify that the node is ready:

```bash
kubectl get nodes
```

The node should show `Ready`.

Example:

```text
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   ...   ...
```

---

## 3. Make the deployment script executable

From the project root:

```bash
chmod +x deploy.sh
```

---

## 4. Run the deployment

Still from the project root:

```bash
./deploy.sh
```

The deployment script builds the required Docker images, makes them available to Minikube, creates the Kubernetes resources, waits for the workloads, and displays the application URLs.

A successful deployment displays URLs similar to:

```text
# Cake Delight deployed successfully!

Frontend:
http://192.168.49.2:30080

API Gateway:
http://192.168.49.2:30081
```

The IP address may be different on another machine.

---

## 5. Open the application

Use the **Frontend URL** displayed by `deploy.sh`.

Example:

```text
http://192.168.49.2:30080
```

The frontend communicates with the API Gateway through the configured gateway NodePort.

---

# Kubernetes Services

The Kubernetes deployment contains the following main components:

| Component | Kubernetes Type | Purpose |
|---|---|---|
| Frontend | NodePort | User interface |
| API Gateway | NodePort | External API entry point |
| Catalog Service | ClusterIP | Internal catalogue API |
| Order Service | ClusterIP | Internal basket/order API |
| Rating Service | ClusterIP | Internal rating API |
| Notification Service | ClusterIP | Internal notification API |
| Mongo Catalog | ClusterIP | Catalog database |
| Mongo Order | ClusterIP | Order database |
| Mongo Rating | ClusterIP | Rating database |
| Mongo Notification | ClusterIP | Notification database |
| RabbitMQ | ClusterIP | Message broker |

Only the frontend and API Gateway need to be externally accessible in the local Kubernetes deployment.

---

# Persistent Storage

MongoDB and RabbitMQ use Kubernetes PersistentVolumeClaims.

Check them with:

```bash
kubectl get pvc -n cake-delight
```

Expected resources include:

```text
mongo-catalog-pvc
mongo-order-pvc
mongo-rating-pvc
mongo-notification-pvc
rabbitmq-pvc
```

Check persistent volumes with:

```bash
kubectl get pv
```

A PVC with status `Bound` indicates that it is attached to a persistent volume.

## Persistence across Minikube stop/start

Stopping Minikube does not mean the Kubernetes resources are deleted.

Stop:

```bash
minikube stop
```

Start again later:

```bash
minikube start
```

Check:

```bash
kubectl get pods -n cake-delight
kubectl get pvc -n cake-delight
```

The existing deployments and persistent volumes can be used again without running the entire setup process.

---

# Application Flow

The main ordering flow is:

```text
User
 |
 | Browse cakes
 v
Catalog Service
 |
 | Add cake
 v
Basket
 |
 | Checkout
 v
Order created
 |
 | status = PENDING
 v
Payment screen
 |
 | Pay
 v
Order status = COMPLETED
 |
 +--------------------+
 |                    |
 v                    v
RabbitMQ          Order History
 |
 | order.completed
 +-----------------------+
 |                       |
 v                       v
Rating Service      Notification Service
 |                       |
 v                       v
Pending Rating       Notification
```

The important distinction is:

- **Checkout creates a `PENDING` order.**
- **Payment completion changes the order to `COMPLETED`.**
- Only when the order becomes `COMPLETED` is the `order.completed` RabbitMQ event published.

---

# API Documentation

The API Gateway is the external API entry point.

The gateway exposes the following paths.

## Catalog Service

### Get all cakes

```http
GET /api/cakes
```

Returns all cakes.

### Search/filter cakes

```http
GET /api/cakes/search
```

Supported query parameters:

```text
name
category
minPrice
maxPrice
```

Example:

```text
/api/cakes/search?category=Birthday
```

### Get a cake

```http
GET /api/cakes/:id
```

Returns one cake using its MongoDB ObjectId.

---

# Basket API

### Get basket

```http
GET /api/basket
```

Returns the current customer's basket.

### Add item

```http
POST /api/basket/items
```

Example body:

```json
{
  "cakeId": "CAKE_ID",
  "quantity": 2
}
```

### Update item quantity

```http
POST /api/basket/items/:cakeId
```

Example body:

```json
{
  "quantity": 3
}
```

### Remove item

```http
DELETE /api/basket/items/:cakeId
```

---

# Order API

### Checkout

```http
POST /api/order/checkout
```

Creates an order from the current basket.

The newly created order starts with:

```text
PENDING
```

### Get order history

```http
GET /api/order
```

Returns the customer's orders.

### Get one order

```http
GET /api/order/:orderId
```

Returns the details of one order.

### Update order status

```http
PATCH /api/order/:orderId/status
```

Example body:

```json
{
  "status": "COMPLETED"
}
```

When the status changes from `PENDING` to `COMPLETED`:

1. `completedAt` is set.
2. The order is saved.
3. An `order.completed` event is published to RabbitMQ.

---

# Rating API

### Get all cake ratings

```http
GET /api/ratings
```

Returns average ratings and total ratings for cakes.

### Submit rating

```http
POST /api/ratings
```

Example:

```json
{
  "cakeId": "CAKE_ID",
  "customerId": "C001",
  "rating": 5
}
```

Ratings must be whole numbers from 1 to 5.

### Get pending ratings

```http
GET /api/ratings/pending/:customerId
```

### Get completed customer ratings

```http
GET /api/ratings/customer/:customerId
```

### Get Average rating for a cake

```http
GET /api/ratings/:cakeId
```

---

# Notification API

### Get customer notifications

```http
GET /api/notifications/:customerId
```

### Mark notification as read

```http
PATCH /api/notifications/:notificationId/read
```

### Delete notification

```http
DELETE /api/notifications/:notificationId
```

---

# RabbitMQ Event Flow

The Order Service publishes an event after an order is completed.

## Exchange

```text
order.events
```

Exchange type:

```text
fanout
```

## Event

```text
order.completed
```

Example event:

```json
{
  "event": "order.completed",
  "data": {
    "orderId": "ORDER_ID",
    "customerId": "C001",
    "items": [],
    "totalAmount": 1500,
    "completedAt": "2026-08-12T12:00:00.000Z"
  }
}
```

The event is consumed independently by:

```text
rating.order.completed
notification.order.completed
```

### Rating consumer

The Rating Service creates a `PENDING` rating record for each cake in the completed order.

### Notification consumer

The Notification Service creates an in-app order confirmation notification.

This allows the Order Service to publish one event while multiple services independently react to it.

---

# Database Models

Each backend service owns its own MongoDB data.

## Catalog

```text
Cake
├── _id
├── name
├── description
├── category
├── price
├── available
├── imageReference
├── createdAt
└── updatedAt
```

## Basket

```text
Basket
├── _id
├── customerId
├── items[]
│   ├── cakeId
│   ├── cakeName
│   ├── quantity
│   ├── unitPrice
│   └── subtotal
├── totalAmount
├── createdAt
└── updatedAt
```

## Order

Orders contain the customer, purchased items, total amount, status, and completion information.

The main order lifecycle is:

```text
Order
├── _id
├── customerId
├── items[]
│   ├── cakeId
│   ├── cakeName
│   ├── quantity
│   ├── unitPrice
│   └── subtotal
├── totalAmount
├── status
├── completedAt
├── createdAt
└── updatedAt
```

## Rating

```text
Rating
├── _id
├── cakeId
├── customerId
├── rating
├── status
├── createdAt
└── updatedAt
```

Rating status:

```text
PENDING
COMPLETED
```

A unique compound index on:

```text
cakeId + customerId
```

ensures that a customer has only one rating record for a particular cake.

## Notification

Notifications contain the order ID, customer ID, notification type, channel, message, read state, delivery state, and timestamps.

---

# Testing the Application

A complete end-to-end test can be performed using the following flow.

## 1. Browse the catalog

Open the frontend and confirm that the seeded cakes are displayed.

The Catalog Service automatically seeds the database when it is empty.

## 2. Add a cake

Add a cake to the basket.

Increase its quantity and confirm that the basket total changes.

## 3. Checkout

Proceed to checkout.

The Order Service creates a new order:

```text
PENDING
```

## 4. Complete payment

Use the payment action in the frontend.

The frontend calls:

```http
PATCH /api/order/:orderId/status
```

with:

```json
{
  "status": "COMPLETED"
}
```

## 5. Verify RabbitMQ event processing

After completion:

```text
Order Service
     |
     v
order.completed
     |
     v
RabbitMQ
    / \
   /   \
  v     v
Rating Notification
```

## 6. Check notifications

Open the Notifications page.

An order completion notification should be available.

Opening the notification marks it as read and displays its associated order details.

## 7. Check ratings

Open the Ratings page.

The purchased cake should appear as a pending rating.

Submit a rating from 1 to 5.

The rating then becomes `COMPLETED`.

---

# Useful Kubernetes Commands

Check all application resources:

```bash
kubectl get all -n cake-delight
```

Check pods:

```bash
kubectl get pods -n cake-delight
```

Check services:

```bash
kubectl get svc -n cake-delight
```

Check persistent storage:

```bash
kubectl get pvc -n cake-delight
kubectl get pv
```

View logs:

```bash
kubectl logs -n cake-delight deployment/catalog-service
kubectl logs -n cake-delight deployment/order-service
kubectl logs -n cake-delight deployment/rating-service
kubectl logs -n cake-delight deployment/notification-service
kubectl logs -n cake-delight deployment/api-gateway
```

Get the frontend URL:

```bash
minikube service frontend -n cake-delight --url
```

Get the API Gateway URL:

```bash
minikube service api-gateway -n cake-delight --url
```

---

# Stopping and Restarting

## Temporarily stop the project

If you want to stop the local Kubernetes cluster without deleting the application:

```bash
minikube stop
```

Later:

```bash
minikube start
```

Then verify:

```bash
kubectl get pods -n cake-delight
```

and:

```bash
kubectl get pvc -n cake-delight
```

You do **not** need to run `./deploy.sh` again just because Minikube was stopped.

---

# Cleanup

The repository contains a `cleanup.sh` script.

From the project root:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

The cleanup script removes the Cake Delight Kubernetes namespace/resources and the Docker images created for the Cake Delight services.

It does **not** delete Minikube itself.

After a cleanup, the project can be deployed again with:

```bash
./deploy.sh
```

The deployment script will rebuild the required images and recreate the Kubernetes resources.

> **Warning:** deleting the `cake-delight` namespace also deletes the Kubernetes resources inside it, including the project's persistent storage claims. Use the cleanup script when you intentionally want a fresh deployment.

---

# Configuration

The API Gateway uses Kubernetes service names for internal communication.

Examples:

```text
catalog-service:3001
order-service:3002
rating-service:3003
notification-service:3004
```

RabbitMQ UI can be accessed by

```text
rabbitmq-service:15672
```

MongoDB services are available internally through their Kubernetes service names:

```text
mongo-catalog
mongo-order
mongo-rating
mongo-notification
```

The frontend uses the API Gateway rather than directly communicating with individual backend services.

---

# Error Handling and Resilience

The services include:

- Centralized Express error handling
- Request logging
- Basic request validation
- MongoDB connection retry logic
- RabbitMQ connection retry logic
- Durable RabbitMQ exchange
- Durable RabbitMQ queues
- Persistent RabbitMQ messages
- Explicit message acknowledgements
- Kubernetes persistent storage

The Catalog Service also contains idempotent startup seeding logic. Seed data is inserted only when the catalog database contains no cakes.

---

# Assumptions and Limitations


### Customer

The current frontend/backend demonstration uses a fixed customer ID:

```text
C001
```

Authentication and authorization are outside the current implementation.

### Payment

The payment flow is simulated through the frontend. Completing the payment action changes the order from `PENDING` to `COMPLETED`.


### Kubernetes environment

The Kubernetes deployment is designed for local execution with Minikube.

### Images

Cake images may use remote image references or local image references depending on the catalogue data.

---

# Future Improvements

Possible future improvements include:

- User authentication and authorization
- Support for multiple customers
- Integration with a real payment provider
- RabbitMQ retry and dead-letter queues
- Kubernetes Ingress
- Horizontal scaling
- Automated CI/CD
- Automated unit and integration tests
- Production cloud deployment
- Improved observability and metrics

---

# Quick Start

For a new user who wants to run the complete Kubernetes deployment:

 **Important:** `./deploy.sh` must be executed from the **root directory of the project**, where `deploy.sh` is located.

Your terminal should be inside:

```text
cake-delight/
```

before running the deployment script.


After deployment, open the **Frontend URL printed by the script**.

To stop temporarily:

```bash
minikube stop
```

To start again:

```bash
minikube start
```

To completely remove the Cake Delight deployment:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

Then, if required, deploy again:

```bash
./deploy.sh
```

---

## Project Summary

Cake Delight demonstrates a complete microservices architecture with:

- Independent backend services
- API Gateway
- Separate MongoDB data stores
- REST APIs
- RabbitMQ event-driven communication
- Docker containerization
- Docker Compose deployment
- Kubernetes deployments
- Persistent volumes
- Automated Minikube deployment
- Automated cleanup
- End-to-end ordering, notification, and rating workflows
