using BlissRecruitment.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace BlissRecruitment.Controllers
{
    public class QuestionController : ApiController
    {

        [Route("health")]
        [HttpGet]
        public async Task<IHttpActionResult> GetHealthStatus()
        {
            ServerHealthModel model = new ServerHealthModel();
            //Check server helth (probably checking some parameter on the server. To be implemented
            //To mokup and tests porpuse it will return Error on Odd's minutes
            if (DateTime.Now.Minute % 2 != 0) {
                model.status = "Service Unavailable. Please try again later.";
                //this.HttpContext.Response.StatusCode = 503;
                //It's missing the change of status on error                 
                return Ok(model);                
            }
            else
            {
                model.status = "Ok";
                return Ok(model);
            }
        }


        [Route("questions/{questionNumber}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionsByID(int questionNumber)
        {
            return Ok();
        }


        [Route("questions")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionsList(int limit=0, int offset=0, string filter="")
        {
            return Ok();
        }

        [Route("questions")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateQuestion(QuestionModel newQuestion)
        {
            return Ok();
        }

        [Route("questions")]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateQuestion(QuestionModel question)
        {
            return Ok();
        }

        [Route("share")]
        [HttpPost]
        public async Task<IHttpActionResult> Share(string destination_email, string content_url)
        {
            return Ok();
        }
    }
}