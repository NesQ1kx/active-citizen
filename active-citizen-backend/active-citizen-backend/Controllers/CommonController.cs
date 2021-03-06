﻿using active_citizen_backend.ViewModels;
using BLLContracts;
using Common.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.Controllers
{
    [Route("api/[controller]")]
    public class CommonController : Controller
    {
        private ICommonBll _commonBll;
        public CommonController(ICommonBll commonBll)
        {
            _commonBll = commonBll;
        }
        
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPost("add-news")]
        public ActionResult AddNews([FromBody] AddNewsViewModel model)
        {
            if (ModelState.IsValid)
            {
                var news = new News()
                {
                    Title = model.Title,
                    Text = model.Text,
                    Image = model.Image,
                    CreateDate = model.CreateDate
                };

                if (_commonBll.AddNews(news))
                {
                    return Ok();
                }
                return BadRequest();
            }
            return BadRequest();
        }

        [HttpGet("get-all-news")]
        public ActionResult GetAllNews()
        {
            return Ok(Json(_commonBll.GetAllNews().ToArray()));
        }

        [HttpGet("get-news/{id}")]
        public ActionResult GetNewsById(int id)
        {
            return Ok(Json(_commonBll.GetNewsById(id)));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpGet("delete-news/{id}")]
        public ActionResult DeleteNews(int id)
        {
            if (_commonBll.DeleteNews(id))
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPut("edit-news")]
        public ActionResult EditNews([FromBody] News news)
        {
            if (_commonBll.EditNews(news))
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
