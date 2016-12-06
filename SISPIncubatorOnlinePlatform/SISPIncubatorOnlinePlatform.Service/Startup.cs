using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;
using SISPIncubatorOnlinePlatform.Service.OAuth;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

[assembly: OwinStartup(typeof(SISPIncubatorOnlinePlatform.Service.Startup))]
namespace SISPIncubatorOnlinePlatform.Service
{
    public class Startup
    {
        public void Configuration(Owin.IAppBuilder app)
        {
            var config = new HttpConfiguration();
            WebApiConfig.Register(config);

            ConfigureOAuth(app);

            app.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            string authUri = ConfigurationManager.AppSettings["AuthUri"];
            int tokenExpiredTime = int.Parse(ConfigurationManager.AppSettings["AuthTokenExpireTime"]);

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString(authUri),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(tokenExpiredTime),
                Provider = new OAuthGrantResourceOwnerProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}