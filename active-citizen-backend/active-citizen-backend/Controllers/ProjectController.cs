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
        public ActionResult LoadProject([FromBody] LoadProjectViewModel model)
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
                    ProjectImage = model.ProjectImage,
                    ParticipantsCount = 0
                };

                foreach (var item in model.ProjectDirection)
                {
                    project.ProjectDirection.Add(new ProjectDirection
                    {
                        DirectionTitle = item.DirectionTitle,
                        DirectionDescription = item.DirectionDescription,
                        CountOfComments = 0,
                        CountOfIdeas = 0,
                    });
                }

                _projectBll.LoadProject(project);

                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("all")]
        public ActionResult GetAll()
        {
            return Ok(Json(_projectBll.GetAll().ToArray()));
        }

        [HttpGet("{id}")]
        public ActionResult GetById(int id)
        {
            var project = _projectBll.GetById(id);
            if (project == null)
            {
                return NotFound();
            } else
            {
                return Ok(Json(project));
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPut("update")]
        public ActionResult UpdateProject([FromBody] Project project)
        {
            if (_projectBll.UpdateProject(project)) {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpDelete("delete/{id}")]
        public ActionResult DeleteProject(int id)
        {
            if (_projectBll.DeleteProject(id))
            {
                return Ok();
            }
            
            return BadRequest();
        }
      
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("participate")]
        public ActionResult Participate([FromBody] Participating participating)
        {
            if (_projectBll.Participate(participating))
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("isParicipate")]
        public ActionResult IsParticipate([FromBody] Participating participating)
        {
            if (_projectBll.IsParticipate(participating))
            {
                return Ok(Json(new { isParicipate = true }));
            }
            return Ok(Json(new { isParicipate = false }));
        }

        [HttpGet("direction/{id}")]
        public ActionResult GetDirection(int id)
        {
            return Ok(Json(_projectBll.GetDirection(id)));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost("add-idea")]
        public ActionResult AddIdea([FromBody] AddIdeaViewModel model)
        {
            var idea = new DirectionIdea
            {
                DirectionId = model.DirectionId,
                IdeaDescription = model.IdeaDescription,
                IdeaTitle = model.IdeaTitle,
                UserId = model.UserId,
                VotesCount = 0,
                Status = 0,
                RejectReason = 0,
                CreateDate = model.CreateDate,
            };

            if (_projectBll.AddIdea(idea))
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("ideas/{id}")]
        public ActionResult GetAllIdeas(int id)
        {
            return Ok(Json(_projectBll.GetAllIdeas(id).ToArray()));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "2")]
        [HttpPut("update-idea")]
        public ActionResult UpdateIdea([FromBody] DirectionIdea idea)
        {
            if (_projectBll.UpdateIdea(idea))
            {
                return Ok();
            }
            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("idea/{id}")]
        public ActionResult GetIdeaById(int id)
        {
            return Ok(Json(_projectBll.GetIdeaById(id)));
        }

    }
}
