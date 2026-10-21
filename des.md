这份岗位要求覆盖了从基础语法、框架、数据库、缓存到微服务、容器化部署的完整技术栈。建议设计的开源项目，可以是一个**高并发的秒杀/订单系统**，以实际业务场景串联起所有技术要求。

### 🏗️ 项目整体定位

项目名称建议：**NestJS-Flash-Sale**（高并发秒杀与订单微服务系统）

这个项目模拟一个电商大促场景，用户针对限量商品下单，系统需要保证不超卖、不宕机，并具备完整的日志监控和部署能力。

### 🛠️ 技术栈覆盖对照表

| 岗位要求 | 项目实现方式 |
| :--- | :--- |
| **JS/TS、类型系统、装饰器** | 全程使用 **TypeScript** 开发；利用 NestJS 的**装饰器**（如 `@Controller`、`@InjectRepository`）和**泛型**（如 `BaseRepository<T>`）实现模块化。 |
| **NestJS / Egg.js** | 选用 **NestJS** 作为核心框架，利用其模块化、依赖注入和微服务支持（`@nestjs/microservices`）。 |
| **MySQL / PostgreSQL** | 使用 **PostgreSQL**，通过 **TypeORM/Prisma** 操作。重点展示**索引优化**（商品表建立唯一索引）、**SQL 调优**（秒杀查询使用覆盖索引）和**事务隔离**（下单时使用 `Serializable` 或乐观锁）。 |
| **Redis 缓存、分布式锁、消息队列** | 用 Redis 做**缓存**（商品详情）；用 **Redlock** 实现**分布式锁**（防止超卖）；用 **Redis Pub/Sub** 或 **BullMQ** 做**消息队列**（异步下单）。 |
| **Linux 服务器基础操作** | 通过**Docker Compose** 编排环境，所有服务在 Linux 容器中运行；编写**日志检索脚本**（使用 `grep` / `awk`）和**性能监控**配置（使用 `pm2` 或 `node --inspect`）。 |
| **Git 与协作流程** | 严格遵循 **GitFlow** 规范（`main` / `develop` / `feature/` 分支），通过 **PR** 合并代码，并配置 **GitHub Actions** 自动化流程。 |
| **ESLint + Prettier、单元测试** | 配置 **ESLint**（规则含 TS 严格模式）和 **Prettier**；使用 **Jest** 编写单元测试（覆盖 Service 层）和集成测试（使用 `supertest` 测 API）。 |
| **微服务与 gRPC** | 拆分为**用户服务**、**商品服务**、**订单服务**。服务间通信使用 **gRPC**（定义 `.proto` 文件），并实现简单的**链路追踪**（如通过 `OpenTelemetry` 传入 `traceId`）。 |
| **RabbitMQ / Kafka** | 使用 **Kafka** 或 **RabbitMQ** 处理订单消息，实现削峰填谷；订单服务消费消息后异步落库。 |
| **Docker + K8s、Helm** | 编写 **Dockerfile**（多阶段构建）和 **K8s 部署文件**（Deployment + Service）；**Helm Chart** 用于管理环境差异（如开发/生产环境的副本数）。 |
| **GraphQL / Prisma / Mongoose** | 商品服务提供 **GraphQL** 接口（使用 `@nestjs/graphql`）；使用 **Prisma** 作为 ORM（替代 TypeORM，更符合要求）；用 **Mongoose** 做日志采集。 |
| **高并发 / 高可用** | 在秒杀接口实现**限流**（`@nestjs/throttler`）、**熔断**（`opossum`）和**降级**；多副本部署保证高可用。 |

### 📈 核心业务逻辑与亮点

1.  **秒杀防超卖**：用户请求先经过 Redis 预扣库存（Lua 脚本保证原子性），若成功则发送 Kafka 消息，订单服务消费后写入数据库。失败则直接返回“售罄”。
2.  **分布式事务**：订单创建与库存扣减采用**最终一致性**方案，通过 Kafka 消息重试机制处理异常。
3.  **链路追踪**：使用 OpenTelemetry 生成 `traceId`，在 gRPC 传递过程中透传，通过日志聚合工具（如 Loki）查看完整调用链路。
4.  **性能压测**：编写 JMeter 脚本，模拟 1000 并发用户抢购，对比开启/关闭 Redis 锁时的吞吐量与错误率，并输出性能报告。

### 💡 简历中如何描述

> **NestJS-Flash-Sale 高并发秒杀系统**
> *   基于 NestJS + TypeScript 构建微服务，使用 **gRPC** 实现服务间通信，通过 **Prisma** 操作 PostgreSQL，**Redis** 实现分布式锁与缓存，**Kafka** 异步处理订单。
> *   采用**装饰器**与**泛型**封装通用逻辑，配置 **ESLint/Prettier** 规范代码，编写 **Jest** 单元测试覆盖率达 80%。
> *   使用 **Docker + K8s + Helm** 完成自动化部署，并通过 Linux 命令排查线上日志与性能瓶颈。
> *   实现秒杀接口的**限流与降级**，成功支撑 1000 并发请求，保证库存数据一致性。

这样设计不仅覆盖了所有硬性技能，还通过微服务和高并发场景体现了架构能力，自然包含了加分项。如果对某个模块（如 gRPC 的具体实现或 Helm Chart 的编写）需要更细化的建议，可以再告诉我。