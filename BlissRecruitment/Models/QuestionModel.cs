using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlissRecruitment.Models
{
    public class QuestionModel
    {
        public int id { get; set; }
        public string question { get; set; }
        public string image_url { get; set; }
        public string thumb_url { get; set; }
        public DateTime published_at { get; set; }
        public List<Choices> choices { get; set; }
    }

    public class Choices
    {
        public string choice { get; set; }
        public int votes { get; set; }

    }
}