using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

[assembly: log4net.Config.XmlConfigurator(Watch = true)]
namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public class LoggerHelper
    {
        private static log4net.ILog log = null;
        private static object lockHelper = new object();
        private static log4net.ILog Logger
        {
            get
            {
                if (log == null)
                {
                    lock (lockHelper)
                    {
                        if (log == null)
                            log = log4net.LogManager.GetLogger("logger");
                    }
                }
                return log;
            }
        }

        public static void Debug(string debugMessage)
        {
            Logger.Debug(debugMessage);
        }

        public static void Info(string infoMessage)
        {
            Logger.Info(infoMessage);
        }

        public static void Warn(string warnMessage)
        {
            Logger.Warn(warnMessage);
        }

        public static void Error(string errorMessage)
        {
            Logger.Error(errorMessage);
        }

        public static void Fatal(string fatalMessage)
        {
            Logger.Fatal(fatalMessage);
        }
    }
}