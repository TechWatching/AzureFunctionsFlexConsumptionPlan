using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AzureFunctionsFlexConsumptionPlan.App;

public class HelloFlexConsumptionPlan
{
    private readonly ILogger<HelloFlexConsumptionPlan> _logger;

    public HelloFlexConsumptionPlan(ILogger<HelloFlexConsumptionPlan> logger)
    {
        _logger = logger;
    }

    [Function("HelloFlexConsumptionPlan")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        return new OkObjectResult("Hello Azure Functions Flex Consumption Plan!");
        
    }

}