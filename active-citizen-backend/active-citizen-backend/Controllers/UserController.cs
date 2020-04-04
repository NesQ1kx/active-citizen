using active_citizen_backend.ViewModels;
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
                };

                _userBll.AddUser(user);


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
                District = user.DistrictNavigation,
                Snils = user.Snils,
                Role = user.Role,
                Email = user.Email,
                Sex = user.Sex,
                IsConfirmedEmail = user.IsConfirmedEmail,
                IsBlocked = user.IsBlocked,
                Id = user.Id,
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
    }
}
