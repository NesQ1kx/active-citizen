﻿using active_citizen_backend.ViewModels;
using BLLContracts;
using Common.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace active_citizen_backend.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private IUserBll _userBll;
        public UserController(IUserBll userBll)
        {
            _userBll = userBll;
        }

        [HttpPost("signup")]
        public ActionResult SignUp([FromBody]SignUpViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (!_userBll.CheckUserUniqueness(model.Email))
                {
                    return BadRequest(new ObjectResult(new { message = "Пользователь с таким адресом уже существует" }));
                }

                if (!_userBll.IsSnilsUnique(model.Snils))
                {
                    return BadRequest(new ObjectResult(new { message = "Пользователь с таким СНИЛС уже существует" }));
                }

                Users user = new Users()
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Patronym = model.Patronym,
                    Email = model.Email,
                    Sex = model.Sex,
                    District = model.District,
                    Password = _userBll.HashPassword(model.Password),
                    IsBlocked = false,
                    IsConfirmedEmail = false,
                    Snils = model.Snils,
                    Role = 1,
                    DateOfBirth = model.DateOfBirth,
                    UserAvatar = model.UserAvatar,
                };

                _userBll.AddUser(user);
                _userBll.SendConfirmationEmail(model.Email);


                return Ok();
            }        
            
            return BadRequest();
        }

        [HttpPost("signin")]
        public ActionResult SignIn([FromBody] SignInViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (_userBll.CheckUserUniqueness(model.Email))
                {
                    return BadRequest(new { message = "Пользователя с таким адресом не существует" });
                }

                if (!_userBll.VerifyUser(model.Email, model.Password))
                {
                    return BadRequest(new { message = "Неверный пароль" });
                }

                var user = _userBll.GetUserByEmail(model.Email);

                if (user.IsBlocked)
                {
                    return BadRequest(new { message = "Ваш аккаунт заблокирован" });
                }

                if (!user.IsConfirmedEmail)
                {
                    return BadRequest(new { message = "Почта не подтверждена" });
                }

                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(GetJwtToken(user));

                var response = new
                {
                    accessToken = encodedJwt,
                    email = user.Email,
                };

                return Ok(new ObjectResult(response));


            }

            return BadRequest();
        }

        [HttpPost("confirm")]
        public ActionResult ConfirmEmail([FromBody] ConfirmEmailViewModel model)
        {
            string email = _userBll.GetEmailFromToken(model.Token);
            var user = _userBll.GetUserByEmail(email);
            if (user != null)
            {
                if (_userBll.ConfirmUserEmail(user.Id))
                {
                    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(GetJwtToken(user));

                    var response = new
                    {
                        accessToken = encodedJwt,
                        email = user.Email,
                    };

                    return Ok(Json(response));
                }
            }

            return BadRequest();
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("get/{email}")]
        public ActionResult GetUserData(string email)
        {
            var user = _userBll.GetUserByEmail(email);
            var response = new
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Patronym = user.Patronym,
                District = user.District,
                DistrictNavigation = user.DistrictNavigation,
                Snils = user.Snils,
                Role = user.Role,
                Email = user.Email,
                Sex = user.Sex,
                IsConfirmedEmail = user.IsConfirmedEmail,
                IsBlocked = user.IsBlocked,
                Id = user.Id,
                DateOfBirth = user.DateOfBirth,
                UserAvatar = user.UserAvatar,
            };

            return Ok(new ObjectResult(response));
        }

        private JwtSecurityToken GetJwtToken(Users user)
        {
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                notBefore: now,
                claims: GetIdentity(user.Email, user.Role).Claims,
                expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            return jwt;
        }

        private ClaimsIdentity GetIdentity(string email, int role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, email),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, role.ToString()),
            };

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);

            return claimsIdentity;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("get-by-id/{id}")]
        public ActionResult GetUserById(int id)
        {
            return Ok(Json(_userBll.GetUserById(id)));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpGet("notify/{projectId}")]
        public ActionResult NotifyUsers(int projectId)
        {
            try
            {
                _userBll.NotifyAboutProjectStart(projectId);
                return Ok();
            } catch(Exception e)
            {
                return BadRequest(Json(e));
            }
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPut("update-role")]
        public ActionResult UpdateUserRole([FromBody] UpdateUserRoleViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (_userBll.UpdateUserRole(model.UserId, model.Role))
                {
                    return Ok();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpGet("toggle-block/{id}")]
        public ActionResult ToggleUserBlock(int id)
        {
            if (_userBll.ToggleUserBlock(id))
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("update-avatar")]
        public ActionResult UpdateUserAvatar([FromBody] UpdateAvatarViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (_userBll.UpdateUserAvatar(model.UserId, model.Avatar))
                {
                    return Ok();
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("delete-avatar/{userId}")]
        public ActionResult DeleteUserAvatar(int userId)
        {
            if (_userBll.DeleteUserAvatar(userId))
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("edit-profile")]
        public ActionResult EdituserProfile([FromBody] EditUserProfileViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _userBll.GetUserById(model.Id);
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Patronym = model.Patronym;
                user.Snils = model.Snils;
                user.DateOfBirth = model.DateOfBirth;
                user.District = model.District;

                if (_userBll.EditUserProfile(user))
                {
                    return Ok();
                }

                return BadRequest();
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "3")]
        [HttpPost("search-users")]
        public ActionResult SearchUsers([FromBody] SearchUsersViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (model.SearchType == "FIO")
                {
                    return Ok(Json(_userBll.SearchByFio(model.Fragment)));
                } else
                {
                    return Ok(Json(_userBll.SearchByEmail(model.Fragment)));
                }
            }

            return BadRequest();
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("change-password")]
        public ActionResult ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (_userBll.VerifyUser(model.Email, model.OldPassword))
                {
                   if (_userBll.HashPassword(model.OldPassword) == _userBll.HashPassword(model.NewPassword))
                    {
                        return BadRequest(new { message = "Старый и новый пароли не могут совпадать" });
                    }
                    else if (_userBll.ChangePassword(model.Email, _userBll.HashPassword(model.NewPassword)))
                    {
                        return Ok();
                    }

                }

                return BadRequest(new { message = "Неверный пароль" });

            }

            return BadRequest();
        }

        [HttpGet("request-reset/{email}")]
        public ActionResult RequestPasswordReset(string email)
        {
            var user = _userBll.GetUserByEmail(email);
            if (user != null)
            {
                try
                {
                    _userBll.SendResetRequest(email);
                    return Ok();
                } catch (Exception e)
                {
                    return BadRequest(new { message = "Ошибка сервера" });
                }
            } else
            {
                return BadRequest(new { message = "Пользователя не существует" });
            }
        }

        [HttpPut("reset-password")]
        public ActionResult ResetPassword([FromBody] ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                string email = _userBll.GetEmailFromToken(model.Token);
                if (_userBll.ChangePassword(email, _userBll.HashPassword(model.Password)))
                {
                    return Ok();
                }

                return BadRequest();

            }

            return BadRequest();
        }

    }
}
