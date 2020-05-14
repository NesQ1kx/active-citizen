using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Common.Entities
{
    public partial class ActiveCitizenContext : DbContext
    {
        public ActiveCitizenContext()
        {
        }

        public ActiveCitizenContext(DbContextOptions<ActiveCitizenContext> options)
            : base(options)
        {
        }

        public virtual DbSet<DirectionIdea> DirectionIdea { get; set; }
        public virtual DbSet<Districts> Districts { get; set; }
        public virtual DbSet<IdeaComment> IdeaComment { get; set; }
        public virtual DbSet<News> News { get; set; }
        public virtual DbSet<Participating> Participating { get; set; }
        public virtual DbSet<Project> Project { get; set; }
        public virtual DbSet<ProjectDirection> ProjectDirection { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<Voting> Voting { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DEXP\\SQLEXPRESS;Database=ActiveCitizen;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DirectionIdea>(entity =>
            {
                entity.Property(e => e.IdeaDescription).IsRequired();

                entity.Property(e => e.IdeaTitle)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.Direction)
                    .WithMany(p => p.DirectionIdea)
                    .HasForeignKey(d => d.DirectionId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_DirectionIdea_ProjectDirection");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.DirectionIdea)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_DirectionIdea_Users");
            });

            modelBuilder.Entity<Districts>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<IdeaComment>(entity =>
            {
                entity.Property(e => e.CommentText).IsRequired();

                entity.HasOne(d => d.Idea)
                    .WithMany(p => p.IdeaComment)
                    .HasForeignKey(d => d.IdeaId)
                    .HasConstraintName("FK_IdeaComment_DirectionIdea");

                entity.HasOne(d => d.ParrentCommentNavigation)
                    .WithMany(p => p.InverseParrentCommentNavigation)
                    .HasForeignKey(d => d.ParrentComment)
                    .HasConstraintName("FK_IdeaComment_IdeaComment");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.IdeaComment)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_IdeaComment_Users");
            });

            modelBuilder.Entity<News>(entity =>
            {
                entity.Property(e => e.Image).IsRequired();

                entity.Property(e => e.Text).IsRequired();

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Participating>(entity =>
            {
                entity.HasKey(e => e.ParticipationId);

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.Participating)
                    .HasForeignKey(d => d.ProjectId)
                    .HasConstraintName("FK_Participating_Project");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Participating)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Participating_Users");
            });

            modelBuilder.Entity<Project>(entity =>
            {
                entity.Property(e => e.ProjectDescription).IsRequired();

                entity.Property(e => e.ProjectImage).IsRequired();

                entity.Property(e => e.ProjectTitle)
                    .IsRequired()
                    .HasMaxLength(250);
            });

            modelBuilder.Entity<ProjectDirection>(entity =>
            {
                entity.Property(e => e.DirectionDescription).IsRequired();

                entity.Property(e => e.DirectionTitle)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.HasOne(d => d.Project)
                    .WithMany(p => p.ProjectDirection)
                    .HasForeignKey(d => d.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ProjectDirection_Project");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Patronym)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.DistrictNavigation)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.District)
                    .HasConstraintName("FK_Users_Districts");
            });

            modelBuilder.Entity<Voting>(entity =>
            {
                entity.HasOne(d => d.Idea)
                    .WithMany(p => p.Voting)
                    .HasForeignKey(d => d.IdeaId)
                    .HasConstraintName("FK_Voting_DirectionIdea");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Voting)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Voting_Users");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
