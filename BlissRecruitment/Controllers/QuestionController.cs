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
            QuestionModel model = new QuestionModel();
            //Here we would request the method from Entities project that would return one question

            //var jsonResult = Entities.GetQuestionsByID(questionNumber);
            //model = JsonConvert.DeserializeObject<QuestionModel>(jsonResult);

            return Ok(model);
        }


        [Route("questions")]
        [HttpGet]
        public async Task<IHttpActionResult> GetQuestionsList(int limit=0, int offset=0, string filter="")
        {
            List<QuestionModel> modelList = new List<QuestionModel>();

            //var jsonResult = Entities.GetQuestionsList(limit, offset, filter);
            //inside of  Entities.GetQuestionsList I would apply the limit, offset and filter using linq

            //modelList = JsonConvert.DeserializeObject<QuestionModel>(jsonResult);

            return Ok(modelList);
        }

        [Route("questions")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateQuestion(QuestionModel newQuestion)
        {

            //Could add some error control here to check if the question was created or not
            //var jsonResult = Entities.CreateQuestion(newQuestion);

            return Ok();
        }

        [Route("questions")]
        [HttpPut]
        public async Task<IHttpActionResult> UpdateQuestion(QuestionModel question)
        {


            //Could add some error control here to check if the question was created or not
            //var jsonResult = Entities.UpdateQuestion(newQuestion);
            return Ok();
        }

        [Route("share")]
        [HttpPost]
        public async Task<IHttpActionResult> Share(string destination_email, string content_url)
        {
            //From my interpertation this share is just to log the event in the database, so the methot would log the 2 parameters and the datetime.
            //If is suposed to send email here I would use some common library to do that job.
            //var jsonResult = Entities.ShareInsert(destination_email, content_url);
            return Ok();
        }
    }
}