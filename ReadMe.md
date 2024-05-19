npm init -y

npm install @grpc/grpc-js @grpc/proto-loader express

define gRPC proto files

```
service Processing {
  rpc Process (OrderRequest) returns (stream OrderStatusUpdate) {}
}

message OrderRequest {
  required uint32 recipeId = 1;
  required uint32 orderId = 2;
}

enum OrderStatus {
    NEW = 1;
    QUEUED = 2;
    PROCESSING = 3;
    DONE = 4;
}

message OrderStatusUpdate {
  required OrderStatus status = 1;
}
```

Load proto files with `protoLoader`

```
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../protos/processing.proto")
);
```

define gRPC server and add services to it

```

const server = new grpc.Server();
server.addService(processingProto.Processing.service, { process });
server.bindAsync(
  "0.0.0.0:50052",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Processing gRPC server running");
  }
);
```

any server can be accessed as:

```
const recipesStub = new recipesProto.Recipes(
  "0.0.0.0:50051",
  grpc.credentials.createInsecure()
);
```
