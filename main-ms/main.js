const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinitionReci = protoLoader.loadSync(
  path.join(__dirname, "../protos/recipes.proto")
);
const packageDefinitionProc = protoLoader.loadSync(
  path.join(__dirname, "../protos/processing.proto")
);
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci);
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc);

const recipesStub = new recipesProto.Recipes(
  "0.0.0.0:50051",
  grpc.credentials.createInsecure()
);
const processingStub = new processingProto.Processing(
  "0.0.0.0:50052",
  grpc.credentials.createInsecure()
);

let productId = 1000;
let orderId = 1;

console.log();

recipesStub.find({ id: productId }, (err, recipe) => {
  console.log("Found a recipe:");
  console.log(recipe);
  console.log("Processing...");
  const call = processingStub.process({ orderId, recipeId: recipe.id });
  call.on("data", (statusUpdate) => {
    console.log("Order status changed:");
    console.log(statusUpdate);
  });
  call.on("end", () => {
    console.log("Processing done.");
  });
});
