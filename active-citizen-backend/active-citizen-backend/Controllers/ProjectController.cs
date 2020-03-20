using active_citizen_backend.ViewModels;
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
    public class ProjectController : Controller
    {
        private IProjectBll _projectBll;
        public ProjectController(IProjectBll projectBll)
        {
            _projectBll = projectBll;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPost("load")]
        public ActionResult LoadProject(LoadProjectViewModel model)
        {
            if (ModelState.IsValid)
            {
                var project = new Project
                {
                    ProjectTitle = model.ProjectTitle,
                    ProjectDescription = model.ProjectDescription,
                    ProposeStartDate = model.ProposeStartDate,
                    ProposeEndDate = model.ProposeEndDate,
                    VoteStartDate = model.VoteStartDate,
                    VoteEndDate = model.VoteEndDate,
                    IsProjectActive = model.IsProjectActive,
                };

                return Ok();
            }

            return BadRequest();
        }
    }
}
