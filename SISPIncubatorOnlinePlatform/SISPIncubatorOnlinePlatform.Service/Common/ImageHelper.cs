using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls.WebParts;
//using System.Xml.Linq;

using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    /// <summary>
    /// 图片处理类
    /// 1、生成缩略图片或按照比例改变图片的大小和画质
    /// 2、将生成的缩略图放到指定的目录下
    /// </summary>
    public class ImageHelper
    {
        public Image ResourceImage;
        private int ImageWidth;
        private int ImageHeight;

        public string ErrMessage;

        /// <summary>
        /// 类的构造函数
        /// </summary>
        /// <param name="ImageFileName">图片文件的全路径名称</param>
        public ImageHelper(string ImageFileName)
        {
            ResourceImage = Image.FromFile(ImageFileName);
            ErrMessage = "";
        }

        public bool ThumbnailCallback()
        {
            return false;
        }

        /// <summary>
        /// 生成缩略图重载方法1，返回缩略图的Image对象
        /// </summary>
        /// <param name="Width">缩略图的宽度</param>
        /// <param name="Height">缩略图的高度</param>
        /// <returns>缩略图的Image对象</returns>
        public Image GetReducedImage(int Width, int Height)
        {
            try
            {
                Image ReducedImage;

                Image.GetThumbnailImageAbort callb = new Image.GetThumbnailImageAbort(ThumbnailCallback);

                ReducedImage = ResourceImage.GetThumbnailImage(Width, Height, callb, IntPtr.Zero);

                return ReducedImage;
            }
            catch (Exception e)
            {
                ErrMessage = e.Message;
                return null;
            }
        }

        /// <summary>
        /// 生成缩略图重载方法2，将缩略图文件保存到指定的路径
        /// </summary>
        /// <param name="Width">缩略图的宽度</param>
        /// <param name="Height">缩略图的高度</param>
        /// <param name="targetFilePath">缩略图保存的全文件名，(带路径)，参数格式：D:\Images\filename.jpg</param>
        /// <returns>成功返回true，否则返回false</returns>
        public bool GetReducedImage(int Width, int Height, string targetFilePath)
        {
            try
            {
                Image ReducedImage;

                Image.GetThumbnailImageAbort callb = new Image.GetThumbnailImageAbort(ThumbnailCallback);

                ReducedImage = ResourceImage.GetThumbnailImage(Width, Height, callb, IntPtr.Zero);
                ReducedImage.Save(@targetFilePath, ImageFormat.Jpeg);

                ReducedImage.Dispose();

                return true;
            }
            catch (Exception e)
            {
                ErrMessage = e.Message;
                return false;
            }
        }

        /// <summary>
        /// 生成缩略图重载方法3，返回缩略图的Image对象
        /// </summary>
        /// <param name="Percent">缩略图的宽度百分比如：需要百分之80，就填0.8</param> 
        /// <returns>缩略图的Image对象</returns>
        public Image GetReducedImage(double Percent)
        {
            try
            {
                Image ReducedImage;

                Image.GetThumbnailImageAbort callb = new Image.GetThumbnailImageAbort(ThumbnailCallback);

                ImageWidth = Convert.ToInt32(ResourceImage.Width * Percent);
                ImageHeight = Convert.ToInt32(ResourceImage.Width * Percent);

                ReducedImage = ResourceImage.GetThumbnailImage(ImageWidth, ImageHeight, callb, IntPtr.Zero);

                return ReducedImage;
            }
            catch (Exception e)
            {
                ErrMessage = e.Message;
                return null;
            }
        }

        /// <summary>
        /// 生成缩略图重载方法4，返回缩略图的Image对象
        /// </summary>
        /// <param name="Percent">缩略图的宽度百分比如：需要百分之80，就填0.8</param> 
        /// <param name="targetFilePath">缩略图保存的全文件名，(带路径)，参数格式：D:\Images\filename.jpg</param>
        /// <returns>成功返回true,否则返回false</returns>
        public bool GetReducedImage(double Percent, string targetFilePath)
        {
            try
            {
                Image ReducedImage;

                Image.GetThumbnailImageAbort callb = new Image.GetThumbnailImageAbort(ThumbnailCallback);

                ImageWidth = Convert.ToInt32(ResourceImage.Width * Percent);
                ImageHeight = Convert.ToInt32(ResourceImage.Width * Percent);

                ReducedImage = ResourceImage.GetThumbnailImage(ImageWidth, ImageHeight, callb, IntPtr.Zero);

                ReducedImage.Save(@targetFilePath, ImageFormat.Jpeg);

                ReducedImage.Dispose();

                return true;
            }
            catch (Exception e)
            {
                ErrMessage = e.Message;
                return false;
            }
        }

        public static bool GetReducedImage(string sourceFilePath)
        {
            if (File.Exists(sourceFilePath))
            {
                //获取配置信息
                int smallMaxWidth = Convert.ToInt32(ConfigurationManager.AppSettings["SmallThumbMaxWidth"]);
                int smallMaxHeight = Convert.ToInt32(ConfigurationManager.AppSettings["SmallThumbMaxHeight"]);
                int mediumMaxWidth = Convert.ToInt32(ConfigurationManager.AppSettings["MediumThumbMaxWidth"]);
                int mediumMaxHeight = Convert.ToInt32(ConfigurationManager.AppSettings["MediumThumbMaxHeight"]);
                if (smallMaxWidth == 0 || smallMaxHeight == 0 || mediumMaxWidth == 0 || mediumMaxHeight == 0)
                {
                    return false;
                }

                ImageHelper helper = new ImageHelper(sourceFilePath);
                //获取原图宽度、高度
                int srcImgWidth = helper.ResourceImage.Width;
                int srcImgHeight = helper.ResourceImage.Height;
                //判断宽度大还是高度大
                if ( srcImgWidth>= srcImgHeight)
                {
                    //如果大于中缩略图最大宽度，则生成中图
                    if (srcImgWidth > mediumMaxWidth)
                    {
                        int height = (int)(srcImgHeight / ((double)srcImgWidth / mediumMaxWidth));
                        string mediumThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_m");
                        helper.GetReducedImage(mediumMaxWidth, height, mediumThumbPath);
                    }
                    else //否则拷贝原图做为中缩略图
                    {
                        string mediumThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_m");
                        File.Copy(sourceFilePath, mediumThumbPath,true);                        
                    }

                    //如果大于小缩略图最大宽度，则生成小图
                    if (srcImgWidth > smallMaxWidth)
                    {
                        int height = (int)(srcImgHeight / ((double)srcImgWidth / smallMaxWidth));
                        string smallThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'),"_s");
                        return helper.GetReducedImage(smallMaxWidth, height, smallThumbPath);
                    }
                    else //否则拷贝原图做为小缩略图
                    {
                        string smallThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_s");
                        File.Copy(sourceFilePath, smallThumbPath,true);
                    }
                }
                else
                {
                    //如果大于中缩略图最大高度，则生成中图
                    if (srcImgHeight > mediumMaxHeight)
                    {
                        int width = (int) (srcImgWidth / ((double)srcImgHeight / mediumMaxHeight));
                        string mediumThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_m");
                        helper.GetReducedImage(width, mediumMaxHeight, mediumThumbPath);
                    }
                    else //否则拷贝原图做为中缩略图
                    {
                        string mediumThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_m");
                        File.Copy(sourceFilePath, mediumThumbPath,true);
                    }

                    //如果大于小缩略图最大宽度，则生成小图
                    if (srcImgHeight > smallMaxHeight)
                    {
                        int width = (int)(srcImgWidth / ((double)srcImgHeight / smallMaxHeight));
                        string smallThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_s");
                        return helper.GetReducedImage(width, smallMaxHeight, smallThumbPath);
                    }
                    else //否则拷贝原图做为小缩略图
                    {
                        string smallThumbPath = sourceFilePath.Insert(sourceFilePath.LastIndexOf('.'), "_s");
                        File.Copy(sourceFilePath, smallThumbPath,true);
                    }
                }
                return true;
            }
            return false;
        }

        /// <summary>
        /// 将正方形图像截取为圆形图像，并保存图片到原图片相同路径下，命名为：原图片名称 + _r.png
        /// </summary>
        /// <param name="sourceFilePath">原图片物理路径</param>
        public static void GetRoundnessImage(string sourceFilePath)
        {
            if (string.IsNullOrEmpty(sourceFilePath)) return;
            if (!File.Exists(sourceFilePath)) return;

            using (System.Drawing.Image sourceImg = System.Drawing.Image.FromFile(sourceFilePath))
            {
                using (GraphicsPath gPath = new GraphicsPath())
                {
                    int left = 0;
                    int top = 0;
                    int ellipseWidth = 0;

                    if (sourceImg.Width > sourceImg.Height)
                    {
                        ellipseWidth = sourceImg.Height;
                        left = (sourceImg.Width - sourceImg.Height) / 2;
                    }
                    else if (sourceImg.Width < sourceImg.Height)
                    {
                        ellipseWidth = sourceImg.Width;
                        top = (sourceImg.Height - sourceImg.Width) / 2;
                    }
                    else
                    {
                        ellipseWidth = sourceImg.Width;
                    }

                    gPath.AddEllipse(new Rectangle(0, 0, ellipseWidth, ellipseWidth));
                    System.Drawing.Image targetImg = new Bitmap(ellipseWidth, ellipseWidth);
                    using (Graphics graphics = Graphics.FromImage(targetImg))
                    {
                        Brush brush = new TextureBrush(sourceImg, WrapMode.TileFlipXY, new Rectangle(left, top, ellipseWidth, ellipseWidth));
                        graphics.FillPath(brush, gPath);
                        graphics.Save();
                        string fileName = Path.GetFileName(sourceFilePath);
                        string path = sourceFilePath.Replace(fileName, "");
                        fileName = Path.GetFileNameWithoutExtension(sourceFilePath);
                        string ext = Path.GetExtension(sourceFilePath);
                        string savePath = path + fileName + "_r" + ext;
                        targetImg.Save(savePath);
                        targetImg.Dispose();
                        brush.Dispose();
                    }
                }
            }
        }
    }
}